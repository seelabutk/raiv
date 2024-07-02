/* global chrome */
import { getNewAction, BaseAction, copyAction } from '@/store/actions'
import getUserAgentInfo from '@/utils/getUserAgentInfo'

export default class ActionMap {
  constructor() {
    this.root = new BaseAction()
    this.independentActions = [] // A list of actions which are not children of any other action.
    this.height = document.documentElement.scrollHeight
    this.interactionType = 'click'
    this.independentAction = false
    this.parentActions = [this.root] // A list of actions which any new Action should be added to.
    this.width = window.innerWidth
    this.changedStyles = []
  }

  reset() {
    this.root = new BaseAction()
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

  _deepChildrenCopy(parent, node) {
    if (
      node === undefined ||
      node.children === undefined ||
      node.children.length === 0
    ) {
      return
    }

    const children = node.children
    const origLength = parent.children.length
    for (let index = 0; index < children.length; index++) {
      const childObj = children[index]

      // node.children[index] = new Action(node, target)
      let idx = origLength + index
      let newAction = copyAction(childObj)
      newAction.parent = parent
      parent.children.push(newAction)
      console.log(parent, parent.children, newAction, idx)
      this._deepChildrenCopy(parent.children[idx], childObj)
      console.log(parent, parent.children, newAction, idx, origLength, index)
      parent.frameCount += parent.children[idx].frameCount
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

      // node.children[index] = new Action(node, target)
      node.children[index] = getNewAction(node, target, childObj.boundingBox, {
        type: childObj.type,
      })
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
      node.children[index].sliderOrientation =
        childObj.sliderOrientation || 'horizontal'
      node.children[index].sliderSteps = childObj.sliderSteps || 1
      node.children[index].sliderValue = childObj.sliderValue || 0
      this._load(node.children[index])
      node.frameCount += node.children[index].frameCount
    }
  }

  _loadIndependentActions(independentActions) {
    for (let index = 0; index < independentActions.length; index++) {
      const obj = independentActions[index]
      window.scrollTo(0, obj.scrollPosition)

      const target = document.elementFromPoint(...obj.clickPosition)

      // const action = new Action(undefined, target)
      let action = getNewAction(undefined, target, obj.boundingBox, {
        type: obj.type,
      })
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
      action.sliderOrientation = obj.sliderOrientation || 'horizontal'
      action.sliderSteps = obj.sliderSteps || 1
      action.sliderValue = obj.sliderValue || 0
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
    // const action = new Action(parent, target, boundingBox, {
    const action = getNewAction(parent, target, boundingBox, {
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
    // const action = new Action(undefined, target, boundingBox, {
    const action = getNewAction(undefined, target, boundingBox, {
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

  _prepareSlider(parent, action) {
    if (action.type !== 'slider') return 0

    const tagName = action.target.tagName.toLowerCase()

    const newActions = []
    const [left, top, right, bottom] = action.boundingBox

    const height = bottom - top
    const width = right - left
    const sliderOrientation = action.sliderOrientation
    const sliderSteps = action.sliderSteps

    const offset =
      sliderOrientation === 'horizontal'
        ? width / sliderSteps
        : height / sliderSteps

    // if the tagName is an input we need to set the value directly
    const deltaValue = 
      tagName === 'input' ? action.target.max - action.target.min : 0;
    const minValue = Number(action.target.min || 0)

    for (let i = 0; i < sliderSteps; i++) {
      const newBoundingBox = [
        left + (sliderOrientation === 'horizontal' ? offset * i : 0),
        top + (sliderOrientation === 'vertical' ? offset * i : 0),
        left + (sliderOrientation === 'horizontal' ? offset * (i + 1) : width),
        top + (sliderOrientation === 'vertical' ? offset * (i + 1) : height),
      ]
      const newClickPosition = [
        left +
          (sliderOrientation === 'horizontal' ? offset * (i + 0.5) : width / 2),
        top +
          (sliderOrientation === 'vertical' ? offset * (i + 0.5) : height / 2),
      ]
      if (i === 0) {
        action.boundingBox = newBoundingBox
        action.clickPosition = newClickPosition
        action.type = 'slider'
        if(action.sliderValue == 0){
          if(sliderSteps === 1)
            action.sliderValue = minValue + i * ((deltaValue-minValue)/(sliderSteps))
          else
            action.sliderValue = minValue + i * ((deltaValue-minValue)/(sliderSteps-1))
        }
        //action.sliderValue = minValue + deltaValue * ((i + 0.5) / sliderSteps)
      } else {
        const newAction = getNewAction(parent, action.target, newBoundingBox, {
          type: 'slider',
        })
        newAction.clickPosition = newClickPosition
        newAction.disableSiblings = action.disableSiblings
        newAction.manualCapture = action.manualCapture
        //newAction.sliderValue = minValue + deltaValue * ((i + 0.5) / sliderSteps)
        newAction.sliderValue = minValue + i * ((deltaValue-minValue)/(sliderSteps-1))
        this._deepChildrenCopy(newAction, action)
        newActions.push(newAction)
      }
    }
    const oldIndex = parent.children.indexOf(action)
    parent.children.splice(oldIndex + 1, 0, ...newActions)
    return newActions.length
  }

  _prepareCanvas(parent, action) {
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
            const newAction = getNewAction(
              parent,
              action.target,
              newBoundingBox,
              {
                type: action.type,
              }
            )

            newAction.clickPosition = newClickPosition

            newAction.disableSiblings = action.disableSiblings
            newAction.manualCapture = action.manualCapture
            this._deepChildrenCopy(newAction, action)

            newActions.push(newAction)
          }
        }
      }
      const oldIndex = parent.children.indexOf(action)
      parent.children.splice(oldIndex + 1, 0, ...newActions)
    }
    return newActions.length
  }

  _preparePositions(action, position) {
    // Each Action needs to have a frame position assigned to it so we can seek properly
    // during playback.
    action.position = position++

    // Account for independent actions
    position += this.independentActions.length

    // Recursively prepare positions for children
    for (let index = 0; index < action.children.length; index++) {
      position = this._preparePositions(action.children[index], position)
    }
    return position
  }

  _prepareActions(action) {
    const parent = action.parent
    // NOTE: This should probably be done in another way, but I need to ensure that
    // the object isn't circular before sending to the service worker.
    action.parent = undefined

    let numNewActions = 0

    // If this Action is on a canvas and should be repeated, then add Actions to the tree.
    numNewActions += this._prepareCanvas(parent, action)

    // If this Action is a slider, then add Actions to the tree.
    numNewActions += this._prepareSlider(parent, action)

    for (let index = 0; index < action.children.length; index++) {
      this._prepareActions(action.children[index])
    }

    return numNewActions
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
    this._prepareActions(this.root)
    this._preparePositions(this.root, 0)

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
