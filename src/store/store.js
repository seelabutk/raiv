/* global chrome */
import { ref, watch } from 'vue'

import ActionMap from '@/store/ActionMap'

export default class Store {
  constructor() {
    // NOTE: if we need to communicate with the service worker, it would be nice to pass in the port for messages to this method
    this.actionMap = ref(new ActionMap())
    this.lastAction = ref(null)
    this.paused = ref(false)
    this.recording = ref(false)

    //this.load()

    watch([this.paused, this.recording], () => {
      this.save()
    })
  }

  reset() {
    this.actionMap.value = new ActionMap()
    this.lastAction.value = null
    this.paused.value = false
    this.recording.value = false

    this.save()
  }

  load() {
    const storageString = localStorage.getItem('store')
    if (storageString !== null) {
      const storageObj = JSON.parse(storageString)

      this.actionMap.value = storageObj.actionMap
      this.actionMap.value.load()

      this.paused.value = storageObj.paused
      this.recording.value = storageObj.recording

      if (storageObj.lastAction !== null) {
        const lastActionTarget = document.elementFromPoint(
          ...storageObj.lastAction.clickPosition
        )
        const searchResult = this.actionMap.find(lastActionTarget)

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
