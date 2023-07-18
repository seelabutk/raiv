/* global chrome */
import Action from '@/store/Action'
import getUserAgentInfo from '@/utils/getUserAgentInfo'

export default class ActionMap {
  constructor() {
    this.root = new Action()
    this.independentActions = [] // A list of actions which are not children of any other action.
    this.height = document.documentElement.scrollHeight
    this.interactionType = 'click'
    this.independentAction = false
    this.parentActions = [this.root] // A list of actions which any new Action should be added to.
    this.width = window.innerWidth
    this.changedStyles = []
  }

  reset() {
    this.root = new Action()
    this.parentActions = [this.root]
    this.independentActions = []
  }

  set(key, value) {
    this[key] = value
  }

  addParent(action) {
    this.parentActions.push(action)
  }

  removeParent(index) {
    return this.parentActions.splice(index, 1)
  }

  changeParent(action, parent) {
    // remove action from old parent
    action.delete()

    // assign new parent to action
    action.parent = parent

    // add action to new parent
    parent.children.push(action)
    while (parent !== undefined) {
      parent.frameCount++
      parent = parent.parent
    }
  }

  // TODO: Determine if there's any way to do this in a robust way. The challenge is that
  // document.elementFromPoint will fail if the clickPosition is only valid if prior actions
  // have been taken.
  _load(node) {
    for (let index = 0; index < node.children.length; index++) {
      const childObj = node.children[index]
      window.scrollTo(0, childObj.scrollPosition)

      const target = document.elementFromPoint(...childObj.clickPosition)

      node.children[index] = new Action(node, target)
      node.children[index].boundingBox = childObj.boundingBox
      node.children[index].canvasRanges = childObj.canvasRanges
      node.children[index].children = childObj.children
      node.children[index].clickPosition = childObj.clickPosition
      node.children[index].frameCount =
        childObj.canvasRanges[0] * childObj.canvasRanges[1]
      node.children[index].manualCapture = childObj.manualCapture
      node.children[index].scrollPosition = childObj.scrollPosition
      node.children[index].type = childObj.type
      node.children[index].waitTime = childObj.waitTime
      node.children[index].independent = childObj.independent || false

      this._load(node.children[index])
      node.frameCount += node.children[index].frameCount
    }
  }

  _loadIndependentActions(independentActions) {
    for (let index = 0; index < independentActions.length; index++) {
      const obj = independentActions[index]
      window.scrollTo(0, obj.scrollPosition)

      const target = document.elementFromPoint(...obj.clickPosition)

      const action = new Action(undefined, target)
      action.boundingBox = obj.boundingBox
      action.canvasRanges = obj.canvasRanges
      action.children = obj.children
      action.clickPosition = obj.clickPosition
      action.frameCount = obj.canvasRanges[0] * obj.canvasRanges[1]
      action.manualCapture = obj.manualCapture
      action.scrollPosition = obj.scrollPosition
      action.type = obj.type
      action.waitTime = obj.waitTime
      action.independent = obj.independent || true
      this.independentActions.push(action)
    }
  }

  load(storageObj) {
    this.root.children = storageObj.actions
    this._load(this.root)

    this.independentActions = []
    this._loadIndependentActions(storageObj.independentActions || [])
    window.scrollTo(0, 0)
  }

  _add(parent, target, boundingBox, event, type) {
    const action = new Action(parent, target, boundingBox, {
      event,
      type,
      independent: false,
    })

    parent.children.push(action)

    while (parent !== undefined) {
      parent.frameCount++
      parent = parent.parent
    }
  }

  add(target, boundingBox, event) {
    if (this.independentAction) {
      this._addIndependentAction(
        target,
        boundingBox,
        event,
        this.interactionType
      )
      if (this.interactionType === 'toggle') {
        this._addIndependentAction(target, boundingBox, event, 'toggle-off')
      }
      return
    }

    for (let index = 0; index < this.parentActions.length; index++) {
      let parent = this.parentActions[index]
      this._add(parent, target, boundingBox, event, this.interactionType)

      if (this.interactionType === 'toggle') {
        this._add(parent, target, boundingBox, event, 'toggle-off')
      }
    }
  }

  _prepareStyles(serverLocation) {
    let links = document.querySelectorAll('link')
    links = Array.from(links).filter((link) => {
      return (
        (link.rel === 'stylesheet' ||
          link.rel.endsWith('css') ||
          link.rel.endsWith('sass')) &&
        !link.href.startsWith(window.location.origin)
      )
    })
    links.forEach((link) => {
      this.changedStyles.push({
        element: link,
        href: link.href,
        hasCrossOrigin: link.hasAttribute('crossorigin'),
      })
      link.setAttribute('crossorigin', 'anonymous')
      link.href = `${serverLocation}/proxy/${link.href}`
    })
  }
  _revertStyles() {
    this.changedStyles.forEach((style) => {
      style.element.href = style.href
      if (!style.hasCrossOrigin) {
        style.element.removeAttribute('crossorigin')
      }
    })
  }

  _addIndependentAction(target, boundingBox, event, type) {
    const action = new Action(undefined, target, boundingBox, {
      event,
      type,
      independent: true,
    })
    this.independentActions.push(action)
    return action
  }

  deleteIndependentAction(action) {
    const index = this.independentActions.indexOf(action)
    if (index > -1) {
      this.independentActions.splice(index, 1)
    }
    action.delete()
  }

  _prepareActions(action, position) {
    const parent = action.parent

    // NOTE: This should probably be done in another way, but I need to ensure that
    // the object isn't circular before sending to the service worker.
    action.parent = undefined
    // Each Action needs to have a frame position assigned to it so we can seek properly
    // during playback.
    action.position = position++

    // If this Action is on a canvas and should be repeated, then add Actions to the tree.
    const newActions = []
    const [rows, columns] = action.canvasRanges
    if (rows * columns > 1) {
      const [left, top, right, bottom] = action.boundingBox
      const height = bottom - top
      const width = right - left

      const actionHeight = height / rows
      const actionWidth = width / columns

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const newBoundingBox = [
            left + actionWidth * column,
            top + actionHeight * row,
            left + actionWidth * (column + 1),
            top + actionHeight * (row + 1),
          ]
          const newClickPosition = [
            left + actionWidth * (column + 0.5),
            top + actionHeight * (row + 0.5),
          ]

          if (row === 0 && column === 0) {
            action.boundingBox = newBoundingBox
            action.clickPosition = newClickPosition
          } else {
            const newAction = new Action(parent, action.target, {
              type: action.type,
            })

            newAction.boundingBox = newBoundingBox
            newAction.clickPosition = newClickPosition
            newAction.parent = undefined
            newAction.position = position++

            newActions.push(newAction)
          }
        }
      }

      const oldIndex = parent.children.indexOf(action)
      parent.children.splice(oldIndex + 1, 0, ...newActions)
    }

    // Account for independent actions
    position += this.independentActions.length

    for (let index = 0; index < action.children.length; index++) {
      const retValues = this._prepareActions(action.children[index], position)

      position = retValues[0]
      index += retValues[1]
    }

    return [position, newActions.length]
  }

  _getActionMap() {
    return Object.assign(
      {
        metadata: getUserAgentInfo(),
        independentActions: this.independentActions,
      },
      this.root
    )
  }

  async _capture(controls, port) {
    await controls.onPrepare()
    await this.root.capture(port, true, this.independentActions)
    await controls.onFinish()

    window.scrollTo(0, 0)

    port.postMessage({
      complete: true,
      actionMap: this._getActionMap(),
    })
    port.disconnect()

    this._revertStyles()
    this.reset()
  }

  async capture(controls, serverLocation, apiKey, videoName) {
    this._prepareStyles(serverLocation)
    this._prepareActions(this.root, 0)

    const port = chrome.runtime.connect({ name: 'raiv' })
    port.postMessage({
      serverLocation,
      apiKey,
      videoName,
      actionMap: this._getActionMap(),
    })

    port.onMessage.addListener(async (message) => {
      if (message.ready) {
        await this._capture(controls, port)
      }
    })
  }
}
