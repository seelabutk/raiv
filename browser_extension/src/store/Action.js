import domtoimage from 'dom-to-image-more'
import observeDOM from '@/utils/observeDOM'

export default class Action {
  constructor(parent, target, boundingBox, options) {
    if (boundingBox === undefined) {
      boundingBox = []
    }

    if (options === undefined) {
      options = {}
    }

    this.boundingBox = boundingBox
    this.canvasRanges = [1, 1] // the number of rows and columns to treat a canvas as when repeating an Action over it
    this.children = []
    if (options.event !== undefined) {
      this.clickPosition = [options.event.clientX, options.event.clientY]
    } else {
      this.clickPosition = []
    }
    this.disableSiblings = false // during playback, should performing this interaction prevent this Action's siblings from being available (eg because this Action closes a dialog)?
    this.frameCount = 1 // the number of frames this Action and its children represent
    this.manualCapture = false // this forces the Action capture to be confirmed by the user, useful if the user needs to position an element before capture
    this.parent = parent // removed at capture to avoid circular JSON
    this.position // set at capture
    this.scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop
    this.siblings = []
    this.target = target
    this.type = options.type
    this.useSiblings = false
    this.visible = options.visible === true
    this.waitTime = 250 // milliseconds before capture occurs, cannot be below 500ms in Chrome

    this.capturedImageSize = [0, 0] // [width, height] of the captured iamge

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
    // Initiate the interaction
    if (this.target instanceof Element) {
      if (this.type === 'click' || this.type === 'toggle') {
        this.target.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            clientX:
              this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
            clientY:
              this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
          })
        )
      } else if (this.type === 'hover') {
        this.target.dispatchEvent(
          new MouseEvent('mouseover', {
            bubbles: true,
            clientX:
              this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
            clientY:
              this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
          })
        )

        this.target.dispatchEvent(
          new MouseEvent('mousemove', {
            bubbles: true,
            clientX:
              this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
            clientY:
              this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
          })
        )
      }
    }
  }

  _revertActionPreChildren() {
    if (this.type === 'hover') {
      this.target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    }
  }

  _revertActionPostChildren() {
    if (this.type === 'toggle') {
      this.target.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          clientX: this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
          clientY: this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
        })
      )
    }
  }

  async _captureCanvas(port) {
    if (this.manualCapture) {
      await new Promise((resolve) => {
        this._openConfirmCapture(resolve)
      })
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

  async capture(port, root = false) {
    // NOTE: This is necessary for elements that are rendered when their parent is interacted with.
    if (this.clickPosition.length === 2) {
      window.scrollTo(0, this.scrollPosition)
      this.target = document.elementFromPoint(...this.clickPosition)
    }

    // If this is not the root node, wait for the DOM to change before capturing
    let observer = undefined
    let timeout = 1000
    const shouldListen = !root && this.type !== 'toggle-off'
    if (shouldListen) {
      observer = observeDOM(document.body, async (_, _observer) => {
        observer = undefined
        _observer.disconnect()
        await this._captureCanvas(port)
      })
    }

    this._takeAction()

    // If this is the root node, capture without waiting for the DOM to change
    if (!shouldListen) {
      await this._captureCanvas(port)
    }

    // Set a timeout to capture the canvas if the DOM doesn't change
    new Promise((resolve) => {
      setTimeout(async () => {
        if (observer !== undefined) {
          observer.disconnect()
        }
        await this._captureCanvas(port)
        resolve()
      }, timeout)
    })

    await new Promise((resolve) =>
      port.onMessage.addListener((message) => {
        if (message.captured) {
          port.onMessage.removeListener()
          resolve()
        }
      })
    )

    this._revertActionPreChildren()

    for (let index = 0; index < this.children.length; index++) {
      await this.children[index].capture(port)
    }

    this._revertActionPostChildren()
  }

  toggleSiblings(actionMap) {
    const parent = this.parent

    if (this.useSiblings) {
      for (let index = 0; index < this.siblings.length; index++) {
        const action = new Action(parent, this.siblings[index], {
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
