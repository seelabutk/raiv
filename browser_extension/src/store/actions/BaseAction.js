import domtoimage from 'dom-to-image-more'
import observeDOM from '@/utils/observeDOM'

export default class BaseAction {
  constructor(parent, target, boundingBox, options) {
    if (boundingBox === undefined) boundingBox = []
    if (options === undefined) options = {}

    this.position // set at capture
    this.type = 'action' // set by subclasses

    this.parent = parent // removed at capture to avoid circular JSON
    this.target = target
    this.boundingBox = boundingBox
    this.children = []

    this.disableSiblings = false // during playback, should performing this interaction prevent this Action's siblings from being available (eg because this Action closes a dialog)?
    this.frameCount = 1 // the number of frames this Action and its children represent
    this.manualCapture = false // this forces the Action capture to be confirmed by the user, useful if the user needs to position an element before capture
    this.siblings = []
    this.independent = options.independent === true
    this.useSiblings = false
    this.visible = options.visible === true

    this.clickPosition =
      options.event !== undefined
        ? [options.event.clientX, options.event.clientY]
        : []
    this.scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop
    this.waitTime = 0 // milliseconds before capture occurs, cannot be below 500ms in Chrome
    this.timeout = 1000 // timeout for the action to complete, in milliseconds
    this.capturedImageSize = [0, 0] // [width, height] of the captured iamge
    this.canvasRanges = [1, 1] // the number of rows and columns to treate a canvas as when repeating an Action over it
    this.tags = '' // the tags associated with this Action
    if (this.visible) {
      this._findSiblings()
    }
  }

  set(key, value) {
    if (key === 'canvasRanges') {
      const oldCanvasFrames = this.canvasRanges[0] * this.canvasRanges[1]
      const newCanvasFrames = value[0] * value[1]
      const diff = newCanvasFrames - oldCanvasFrames

      this.frameCount += diff
      let parent = this.parent
      while (parent !== undefined) {
        parent.frameCount += diff
        parent = parent.parent
      }
    }

    this[key] = value
  }

  delete() {
    let parent = this.parent

    // Don't delete the root node
    if (parent === undefined) {
      return
    }

    const index = parent.children.indexOf(this)

    parent.children.splice(index, 1)

    while (parent !== undefined) {
      parent.frameCount -= this.frameCount
      parent = parent.parent
    }
  }

  _findSiblings() {
    const parentEl = this.target.parentElement

    if (parentEl !== null) {
      this.siblings = [...parentEl.children].filter(
        (node) => node !== this.target && node.tagName === this.target.tagName
      )
    } else {
      this.siblings = []
    }
  }

  _openConfirmCapture(resolve) {
    const captureElement = document.querySelector('.confirm-capture-dialog')
    captureElement.show()

    const confirmButton = captureElement.querySelector('.confirm-btn')
    confirmButton.addEventListener(
      'click',
      () => {
        resolve()
        captureElement.close()
      },
      { once: true }
    )
  }

  _takeAction() {
    // This is a stub method that should be overridden by subclasses
  }

  _revertActionPreChildren() {
    // This is a stub method that should be overridden by subclasses
  }

  _revertActionPostChildren() {
    // This is a stub method that should be overridden by subclasses
  }

  async _captureCanvas(port) {
    if (this.manualCapture) {
      await new Promise((resolve) => {
        this._openConfirmCapture(resolve)
      })
    }
    //If the webpage has height: 100% (height of screen), extend webpage's height to cover more
    if(((document.body.clientHeight / window.innerHeight) * 100) === 100){
      document.body.style.height = 'initial';
    }
    //RAIV extension height cap that works is 4320px
    if(document.body.clientHeight > 4320){
      document.body.style.height = '4320px'; //the standard 8K height
    }
    //Make the background white if background is transparent so capture is visible
    if(getComputedStyle(document.body).backgroundColor === 'rgba(0, 0, 0, 0)'){
      document.body.style.backgroundColor = 'white';
    }
    const canvas = await domtoimage.toCanvas(document.body)
    this.capturedImageSize = [canvas.width, canvas.height]
    port.postMessage({
      scrollOffset: 0,
      image: canvas.toDataURL('image/png'),
      capture: true,
      lastFrame: true,
      position: this.position,
      scroll: 0,
    })
  }

  async _capture(port, root = false, independentActions = undefined) {
    // NOTE: This is necessary for elements that are rendered when their parent is interacted with.
    if (this.clickPosition.length === 2) {
      window.scrollTo(0, this.scrollPosition)
      this.target = document.elementFromPoint(...this.clickPosition)
    }

    // Determine how the page should be captured. i.e. listen for DOM changes or wait a user specified time
    const useWaitTime =
      root || // If this is the root node
      this.type === 'toggle-off' || // If this is a toggle-off node
      this.waitTime > 0 // If the user has specified a wait time

    let observer = undefined
    if (!useWaitTime) {
      observer = observeDOM(document.body, async (_, _observer) => {
        observer = undefined
        _observer.disconnect()
        // Get the text within the dom
        this.tags = document.body.innerText
        await this._captureCanvas(port)
      })
    }

    this._takeAction()

    if (useWaitTime) {
      // capture without waiting for the DOM to change
      new Promise((resolve) => {
        setTimeout(async () => {
          // Get the text within the dom
          this.tags = document.body.innerText
          await this._captureCanvas(port)
          return resolve()
        }, this.waitTime || 100)
      })
    } else {
      // Set a timeout to capture the canvas if the DOM doesn't change
      new Promise((resolve) => {
        setTimeout(async () => {
          if (observer === undefined) {
            return resolve()
          }
          observer.disconnect()
          observer = undefined
          await this._captureCanvas(port)
          return resolve()
        }, this.timeout)
      })
    }

    // Wait for service worker to respond
    await new Promise((resolve) =>
      port.onMessage.addListener((message) => {
        if (message.captured) {
          port.onMessage.removeListener()
          resolve()
        }
      })
    )
    // Increment the frame position
    this._revertActionPreChildren()

    // Iterate through the independent actions and capture them.
    if (independentActions !== undefined) {
      for (let index = 0; index < independentActions.length; index++) {
        independentActions[index].position = this.position + index + 1
        // position = await independentActions[index].capture(
        await independentActions[index].capture(
          port,
          // position,
          false,
          undefined
        )
      }
    }

    for (let index = 0; index < this.children.length; index++) {
      // position = await this.children[index].capture(
      await this.children[index].capture(
        port,
        // position,
        false,
        independentActions
      )
    }

    this._revertActionPostChildren()
    // return position
  }

  // async capture(port, position, root = false, independentActions = undefined) {
  async capture(port, root = false, independentActions = undefined) {
    // return await this._capture(port, position, root, independentActions)
    return await this._capture(port, root, independentActions)
  }

  toggleSiblings(actionMap) {
    const parent = this.parent

    if (this.useSiblings) {
      for (let index = 0; index < this.siblings.length; index++) {
        const action = new BaseAction(parent, this.siblings[index], {
          copy: this,
          visible: false,
        })

        parent.children.push(action)
        if (actionMap.leaves.indexOf(this) !== -1) {
          actionMap.leaves.push(action)
        }
      }
    } else {
      for (let index = 0; index < this.siblings.length; index++) {
        const siblingIndex = parent.children.findIndex(
          (child) => child.target === this.siblings[index]
        )

        const deleted = parent.children.splice(siblingIndex, 1)
        const leafIndex = actionMap.leaves.indexOf(deleted[0])
        if (leafIndex !== -1) {
          actionMap.leaves.splice(leafIndex, 1)
        }
      }
    }
  }
}
