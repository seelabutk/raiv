/* global chrome */
import Action from '@/store/Action'

export default class ActionMap {
  constructor() {
    this.root = new Action()

    this.height = document.documentElement.scrollHeight
    this.interactionType = 'click'
    this.leaves = [this.root]
    this.width = window.innerWidth
  }

  reset() {
    this.root = new Action()
    this.leaves = [this.root]
  }

  set(key, value) {
    this[key] = value
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
      window.scrollTo(0, childObj.scrollPosition)

      const target = document.elementFromPoint(...childObj.clickPosition)

      node.children[index] = new Action(node, target, {
        visible: childObj.visible,
      })
      node.children[index].boundingBox = childObj.boundingBox
      node.children[index].children = childObj.children
      node.children[index].clickPosition = childObj.clickPosition
      node.children[index].manualCapture = childObj.manualCapture
      node.children[index].scrollPosition = childObj.scrollPosition
      node.children[index].type = childObj.type
      node.children[index].waitTime = childObj.waitTime

      this._load(node.children[index])
      node.frameCount += node.children[index].frameCount
    }
  }

  load(storageObj) {
    this.root.children = storageObj.actions

    this._load(this.root)

    window.scrollTo(0, 0)
  }

  _add(leafIdx, target, event, type, replace) {
    const leaf = this.leaves[leafIdx]
    let parent
    if (replace) {
      // The new node will be a child of leaf
      parent = leaf
    } else {
      // The new node will be a sibling of leaf
      parent = leaf.parent
    }

    const action = new Action(parent, target, {
      event,
      type,
      visible: true,
    })

    parent.children.push(action)

    while (parent !== undefined) {
      parent.frameCount++
      parent = parent.parent
    }

    if (replace) {
      this.leaves.splice(leafIdx, 1, action)
    } else {
      this.leaves.splice(leafIdx + 1, 0, action)
    }
  }

  add(target, event) {
    for (let index = 0; index < this.leaves.length; index++) {
      this._add(index, target, event, this.interactionType, true)

      if (this.interactionType === 'toggle') {
        this._add(index, target, event, 'toggle-off', false)
        index++ // The new node will increase the length of the leaf list by 1
      }
    }
  }

  _assignActionPositions(node, position) {
    // NOTE: This should probably be done in another way, but I need to ensure that
    // the object isn't circular before sending to the service worker.
    node.parent = undefined
    node.position = position++

    for (let index = 0; index < node.children.length; index++) {
      position = this._assignActionPositions(node.children[index], position)
    }

    return position
  }

  async _capture(port) {
    const widget = document.querySelector('#raiv')

    widget.style.display = 'none'

    await this.root.capture(port, this.height)

    widget.style.display = 'block'
    window.scrollTo(0, 0)

    port.postMessage({ complete: true })
    port.disconnect()

    this.reset()
  }

  async capture(serverLocation, videoName) {
    this._assignActionPositions(this.root, 0)

    const port = chrome.runtime.connect({ name: 'raiv' })
    port.postMessage({
      serverLocation,
      videoName,
      actionMap: this.root,
    })

    port.onMessage.addListener((message) => {
      if (message.ready) {
        this._capture(port)
      }
    })
  }
}
