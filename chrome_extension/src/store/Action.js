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

    this.action = options.copy !== undefined ? options.copy.action : 'click'
    this.children = []
    if (options.event !== undefined) {
      this.clickPosition = [options.event.clientX, options.event.clientY]
    } else {
      this.clickPosition = []
    }
    this.parent = parent // removed at capture
    this.position = null // set at capture
    this.scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop
    this.siblings = []
    this.target = target
    this.useSiblings = false
    this.visible = options.visible === true

    if (this.visible) {
      this._findSiblings()
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

  async capture(port, height) {
    // NOTE: This is necessary for elements that are rendered when their parent is interacted with.
    if (this.clickPosition.length === 2) {
      window.scrollTo(0, this.scrollPosition)
      this.target = document.elementFromPoint(...this.clickPosition)
    }

    if (this.target instanceof Element) {
      if (this.action === 'click' || this.action === 'switch') {
        this.target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      } else if (this.action === 'hover') {
        this.target.dispatchEvent(
          new MouseEvent('mouseover', { bubbles: true })
        )
      }
    }

    for (let scroll = 0; scroll < height; scroll += window.innerHeight) {
      window.scrollTo(0, scroll)

      // TODO: Would like to implement a better system for waiting for the above actions to render.
      await new Promise((resolve) => setTimeout(resolve, 500))
      port.postMessage({
        scroll,
        capture: true,
        lastFrame: scroll + window.innerHeight >= height,
        position: this.position,
      })
      await new Promise((resolve) =>
        port.onMessage.addListener((message) => {
          if (message.captured) {
            resolve()
          }
        })
      )
    }

    if (this.action === 'hover') {
      this.target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    }

    for (let index = 0; index < this.children.length; index++) {
      await this.children[index].capture(port, height)
    }

    if (this.action === 'switch') {
      this.target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
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
