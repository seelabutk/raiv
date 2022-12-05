export default class Action {
  constructor(target) {
    const boundingRect = target.getBoundingClientRect()
    const boundingBox = [
      boundingRect.left,
      boundingRect.top,
      boundingRect.right,
      boundingRect.bottom,
    ]

    this.action = 'click'
    this.boundingBox = boundingBox
    this.children = []
    this.clickPosition = [event.clientX, event.clientY]
    this.scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop
    this.target = target
  }
}
