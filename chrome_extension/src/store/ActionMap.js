/* global chrome */
import Action from '@/store/Action'

export default class ActionMap {
  constructor() {
    this.action = null
    this.children = []
    this.height = window.innerHeight
    this.lastAction = null
    this.position = null
    this.target = null
    this.width = window.innerWidth
  }

  _load(node) {
    for (let index = 0; index < node.children.length; index++) {
      const childObj = node.children[index]
      const target = document.elementFromPoint(...childObj.clickPosition)

      node.children[index] = new Action(target)
      node.children[index].action = childObj.action
      node.children[index].boundingBox = childObj.boundingBox
      node.children[index].children = childObj.children
      node.children[index].clickPosition = childObj.clickPosition
      node.children[index].scrollPosition = childObj.scrollPosition

      this._load(node.children[index])
    }
  }

  load(storageObj) {
    this.children = storageObj.actions

    this._load(this)

    if (storageObj.lastAction !== null) {
      const lastActionTarget = document.elementFromPoint(
        ...storageObj.lastAction.clickPosition
      )
      const searchResult = this.find(lastActionTarget)

      this.lastAction = searchResult[0].children[searchResult[1]]
    } else {
      this.lastAction = null
    }
  }

  // Returns the parent of action and its index in parent's children array for easy removal
  _find(node, target) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index]

      if (child.target === target) {
        return [node, index]
      }

      const result = this._find(child, target)
      if (result !== null) {
        return result
      }
    }

    return null
  }

  find(target) {
    return this._find(this, target)
  }

  add(target, event) {
    const action = new Action(target, event)

    if (this.lastAction === null) {
      this.children.push(action)
    } else {
      this.lastAction.children.push(action)
    }

    this.lastAction = action
  }

  remove(target) {
    let removedAction = null
    const searchResult = this._find(this, target)

    if (searchResult !== null) {
      const parent = searchResult[0]
      const index = searchResult[1]

      if (this.lastAction.target === target) {
        // If the parent of the removed action is the root, then we want to set this.lastAction to null so that the next addAction call works.
        if (parent !== this) {
          this.lastAction = parent
        } else {
          this.lastAction = null
        }
      }

      removedAction = parent.children.splice(index, 1)
    }

    return removedAction
  }

  _assignActionPositions(node, position) {
    node.position = position++

    for (let index = 0; index < node.children.length; index++) {
      position = this._assignActionPositions(node.children[index], position)
    }

    return position
  }

  async _capture(port) {
    const widget = document.querySelector('#raiv')

    widget.style.display = 'none'

    // Capture the first frame
    await new Promise((resolve) => setTimeout(resolve, 500))
    port.postMessage({ capture: true, position: this.position })
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (let index = 0; index < this.children.length; index++) {
      await this.children[index].capture(port)
    }

    port.postMessage({ complete: true })

    widget.style.display = 'block'

    port.disconnect()
  }

  async capture(serverLocation, videoName) {
    this._assignActionPositions(this, 0)

    const port = chrome.runtime.connect({ name: 'raiv' })
    port.postMessage({
      serverLocation,
      videoName,
      actionMap: this,
    })

    port.onMessage.addListener((message) => {
      if (message.ready) {
        this._capture(port)
      }
    })
  }
}
