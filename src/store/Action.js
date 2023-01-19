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
      if (this.action === 'click') {
        this.target.click()
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    port.postMessage({ capture: true, position: this.position })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    for (let index = 0; index < this.children.length; index++) {
      await this.children[index].capture(port)
    }
  }
}
