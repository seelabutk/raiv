import BaseAction from './BaseAction.js'

export default class Toggle extends BaseAction {
  constructor(parent, target, boundingBox, options) {
    super(parent, target, boundingBox, options)
    this.type = options.type === 'toggle' ? 'toggle' : 'toggle-off'
  }

  _takeAction() {
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

  _revertActionPreChildren() {
    // This is a stub method that should be overridden by subclasses
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
}
