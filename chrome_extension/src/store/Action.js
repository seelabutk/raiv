export default class Action {
  constructor(target, event) {
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

    this._findSiblings()
  }

  _findSiblings() {
    const parentEl = this.target.parentElement

    if (parentEl !== null) {
      this.siblings = [...parentEl.children].filter(
        (node) => node !== this.target
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

  useParent() {
    if (this.target.parentElement !== null) {
      this.target = this.target.parentElement
      this.parentCount++

      this._findSiblings()
    }
  }
}
