/* global chrome */
import { ref, watch } from 'vue'

export default class Store {
  constructor() {
    // NOTE: if we need to communicate with the service worker, it would be nice to pass in the port for messages to this method
    this.actionMap = ref({
      action: null,
      children: [],
      target: null,
    })
    this.lastAction = ref(null)
    this.paused = ref(false)
    this.recording = ref(false)

    this.load()

    watch([this.paused, this.recording], () => {
      this.save()
    })
  }

  // Returns the parent of action and its index in parent's children array for
  // easy removal from this.actionMap
  _findAction(node, target) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index]

      if (child.target === target) {
        return [node, index]
      }

      const result = this._findAction(child, target)
      if (result !== null) {
        return result
      }
    }

    return null
  }

  // Returns true if the target is already in this.actionMap
  findAction(target) {
    return this._findAction(this.actionMap.value, target) !== null
  }

  addAction(target, event) {
    const boundingRect = target.getBoundingClientRect()
    const boundingBox = [
      boundingRect.left,
      boundingRect.top,
      boundingRect.right,
      boundingRect.bottom,
    ]

    const action = {
      boundingBox,
      target,
      action: 'click',
      children: [],
      clickPosition: [event.clientX, event.clientY],
      scrollPosition:
        document.documentElement.scrollTop || document.body.scrollTop,
    }

    if (this.lastAction.value === null) {
      this.actionMap.value.children.push(action)
    } else {
      this.lastAction.value.children.push(action)
    }

    this.lastAction.value = action

    this.save()
  }

  removeAction(target) {
    let removedAction = null
    const searchResult = this._findAction(this.actionMap.value, target)

    if (searchResult !== null) {
      const parent = searchResult[0]
      const index = searchResult[1]

      if (this.lastAction.value.target === target) {
        // If the parent of the removed action is the root, then we want to set this.lastAction.value to null so that the next addAction call works.
        if (parent !== this.actionMap.value) {
          this.lastAction.value = parent
        } else {
          this.lastAction.value = null
        }
      }

      removedAction = parent.children.splice(index, 1)

      this.save()
    }

    return removedAction
  }

  reset() {
    this.actionMap.value = {
      action: null,
      children: [],
      target: null,
    }
    this.lastAction.value = null
    this.paused.value = false
    this.recording.value = false

    this.save()
  }

  _loadTargets(node) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index]

      child.target = document.elementFromPoint(...child.clickPosition)

      this._loadTargets(child)
    }
  }

  load() {
    const storageString = localStorage.getItem('store')
    if (storageString !== null) {
      const storageObj = JSON.parse(storageString)

      this.actionMap.value = storageObj.actionMap
      this._loadTargets(this.actionMap.value)

      this.paused.value = storageObj.paused
      this.recording.value = storageObj.recording

      if (storageObj.lastAction !== null) {
        const lastActionTarget = document.elementFromPoint(
          ...storageObj.lastAction.clickPosition
        )
        const searchResult = this._findAction(
          this.actionMap.value,
          lastActionTarget
        )

        this.lastAction.value = searchResult[0].children[searchResult[1]]
      } else {
        this.lastAction.value = null
      }
    }
  }

  save() {
    localStorage.setItem(
      'store',
      JSON.stringify({
        actionMap: this.actionMap.value,
        lastAction: this.lastAction.value,
        paused: this.paused.value,
        recording: this.recording.value,
      })
    )
  }

  set(key, value) {
    this[key].value = value
  }

  async _capture(node, port) {
    if (node.target !== null) {
      if (node.action === 'click') {
        node.target.click()
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    port.postMessage({ capture: true })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    for (let index = 0; index < node.children.length; index++) {
      await this._capture(node.children[index], port)
    }
  }

  async capture() {
    const widget = document.querySelector('#raiv')

    widget.style.display = 'none'

    const port = chrome.runtime.connect({ name: 'raiv' })
    await this._capture(this.actionMap.value, port)

    widget.style.display = 'block'

    port.disconnect()
    this.reset()
  }
}
