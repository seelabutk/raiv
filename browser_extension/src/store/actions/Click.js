import BaseAction from './BaseAction.js'

export default class Click extends BaseAction {
  constructor(parent, target, boundingBox, options) {
    super(parent, target, boundingBox, options)
    this.type = 'click'
  }

  _takeAction() {
    if (this.target instanceof Element) {
      this.target.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          clientX: this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
          clientY: this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
        })
      )
    }
  }

  _revertActionPreChildren() {
    // This is a stub method that should be overridden by subclasses
  }

  _revertActionPostChildren() {
    // This is a stub method that should be overridden by subclasses
  }
}
