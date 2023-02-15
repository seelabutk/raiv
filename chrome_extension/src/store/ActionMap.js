/* global chrome */
import Action from '@/store/Action'

export default class ActionMap {
  constructor() {
    this.root = new Action(null)
    this.leaves = [this.root]
    this.height = window.innerHeight
    this.width = window.innerWidth
  }

  // TODO: Determine if there's any way to do this in a robust way. The challenge is that
  // document.elementFromPoint will fail if the clickPosition is only valid if prior actions
  // have been taken.
  _load(node) {
    // If this node has children, then it isn't a leaf so replace it in the leaf list
    if (node.children.length > 0) {
      const leafIndex = this.leaves.indexOf(node)

      if (leafIndex !== -1) {
        this.leaves.splice(leafIndex, 1, ...node.children)
      }
    }

    for (let index = 0; index < node.children.length; index++) {
      const childObj = node.children[index]
      const originalTarget = document.elementFromPoint(
        ...childObj.clickPosition
      )

      let target = originalTarget
      for (let count = 0; count < childObj.parentCount; count++) {
        target = target.parentElement
      }

      node.children[index] = new Action(target, undefined, childObj.visible)
      node.children[index].action = childObj.action
      node.children[index].originalTarget = originalTarget
      node.children[index].boundingBox = childObj.boundingBox
      node.children[index].children = childObj.children
      node.children[index].clickPosition = childObj.clickPosition
      node.children[index].parentCount = childObj.parentCount
      node.children[index].scrollPosition = childObj.scrollPosition

      this._load(node.children[index])
    }
  }

  load(storageObj) {
    this.root.children = storageObj.actions

    this._load(this.root)
  }

  add(target, event) {
    for (let index = 0; index < this.leaves.length; index++) {
      const action = new Action(target, event, true)

      this.leaves[index].children.push(action)
      this.leaves.splice(index, 1, action)
    }
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

    await this.root.capture(port)

    widget.style.display = 'block'

    port.postMessage({ complete: true })
    port.disconnect()
  }

  async capture(serverLocation, videoName) {
    this._assignActionPositions(this.root, 0)

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
