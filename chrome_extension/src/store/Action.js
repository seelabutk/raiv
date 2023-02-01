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
    this.position = null // set at capture
    this.scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop
    this.target = target
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

    await new Promise((resolve) => setTimeout(resolve, 1000))
    port.postMessage({ capture: true, position: this.position })
    await new Promise((resolve) => setTimeout(resolve, 1000))

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
}
