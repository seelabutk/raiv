import BaseAction from './BaseAction.js'

export default class Hover extends BaseAction {
  constructor(parent, target, boundingBox, options) {
    super(parent, target, boundingBox, options)
    this.type = 'hover'
  }

  _takeAction() {
    if (this.target instanceof Element) {
      this.target.dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
          clientX: this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
          clientY: this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
        })
      )

      this.target.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          clientX: this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
          clientY: this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
        })
      )
    }
  }

  _revertActionPreChildren() {
    this.target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
  }

  _revertActionPostChildren() {
    // This is a stub method that should be overridden by subclasses
  }
}
