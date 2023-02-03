export default class Action {
  constructor(target, event, visible) {
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

    this.action = 'click'
    this.children = []
    if (event !== undefined) {
      this.clickPosition = [event.clientX, event.clientY]
    } else {
      this.clickPosition = []
    }
    this.originalTarget = target
    this.parentCount = 0 // How many parentElements are we away from the original target?
    this.position = null // set at capture
    this.scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop
    this.siblings = []
    this.target = target
    this.useSiblings = false
    this.visible = visible

    this._findSiblings()
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

  async capture(port) {
    if (this.target instanceof Element) {
      if (this.action === 'click' || this.action === 'switch') {
        this.target.click()
      } else if (this.action === 'hover') {
        this.target.dispatchEvent(
          new MouseEvent('mouseover', { bubbles: true })
        )
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    port.postMessage({ capture: true, position: this.position })
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (this.action === 'hover') {
      this.target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    }

    for (let index = 0; index < this.children.length; index++) {
      await this.children[index].capture(port)
    }

    if (this.action === 'switch') {
      this.target.click()
    }
  }

  // actionMap is a placeholder until I've switched to using a hashtable for everything
  toggleSiblings(actionMap) {
    if (this.useSiblings) {
      const searchResult = actionMap.find(this.target)
      const parent = searchResult[0]

      for (let index = 0; index < this.siblings.length; index++) {
        parent.children.push(new Action(this.siblings[index], undefined, false))
      }
    } else {
      for (let index = 0; index < this.siblings.length; index++) {
        const searchResult = actionMap.find(this.siblings[index])
        const parent = searchResult[0]
        const siblingIndex = searchResult[1]

        parent.children.splice(siblingIndex, 1)
      }
    }
  }

  useParent() {
    if (this.target.parentElement !== null) {
      this.target = this.target.parentElement
      this.parentCount++

      this._findSiblings()
    }
  }
}
