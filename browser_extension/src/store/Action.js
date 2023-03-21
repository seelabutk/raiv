export default class Action {
  constructor(parent, target, options) {
    if (options === undefined) {
      options = {}
    }

    if (target instanceof Element) {
      const boundingRect = target.getBoundingClientRect()
      const boundingBox = [
        boundingRect.left,
        boundingRect.top,
        boundingRect.right,
        boundingRect.bottom,
      ]

      this.boundingBox = boundingBox
    } else {
      this.boundingBox = []
    }

    this.children = []
    if (options.event !== undefined) {
      this.clickPosition = [options.event.clientX, options.event.clientY]
    } else {
      this.clickPosition = []
    }
    this.frameCount = 1 // the number of frames this Action and its children represent
    this.parent = parent // removed at capture to avoid circular JSON
    this.position = null // set at capture
    this.scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop
    this.siblings = []
    this.target = target
    this.type = options.type
    this.useSiblings = false
    this.visible = options.visible === true

    if (this.visible) {
      this._findSiblings()
    }
  }

  delete() {
    // Don't delete the root node
    if (this.parent === undefined) {
      return
    }

    const index = this.parent.children.indexOf(this)

    this.parent.children.splice(index, 1)
    this.parent.frameCount -= this.frameCount
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

  async capture(port, height) {
    // NOTE: This is necessary for elements that are rendered when their parent is interacted with.
    if (this.clickPosition.length === 2) {
      window.scrollTo(0, this.scrollPosition)
      this.target = document.elementFromPoint(...this.clickPosition)
    }

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
          new MouseEvent('mouseover', { bubbles: true })
        )
      }
    }

    let lastFrame = false
    let scroll = 0
    let scrollIndex = 0
    let scrollOffset = 0 // scrollOffset corresponds to the starting Y position of the last image.
    while (!lastFrame) {
      if (scroll === height) {
        break
      }

      if (scroll + window.innerHeight > height) {
        lastFrame = true
        scrollOffset = window.innerHeight - (height - scroll)

        scroll = height - window.innerHeight // This ensures that tabs don't exceed to max height of the video.
      }

      window.scrollTo(0, scroll)

      // TODO: Would like to implement a better system for waiting for the above actions to render.
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (lastFrame) {
        // The final scrolled section of the page should not duplicate the previous section's portion
        // of the visible tab captured.
        port.postMessage({
          scrollOffset,
          capture: true,
          lastFrame: true,
          position: this.position,
          scroll: scrollIndex++,
        })
      } else {
        port.postMessage({
          capture: true,
          lastFrame: false,
          position: this.position,
          scroll: scrollIndex++,
        })
      }
      await new Promise((resolve) =>
        port.onMessage.addListener((message) => {
          if (message.captured) {
            resolve()
          }
        })
      )

      scroll += window.innerHeight
    }

    if (this.type === 'hover') {
      this.target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    }

    for (let index = 0; index < this.children.length; index++) {
      await this.children[index].capture(port, height)
    }

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
