import BaseAction from './BaseAction.js'

export default class Slider extends BaseAction {
  constructor(parent, target, boundingBox, options) {
    super(parent, target, boundingBox, options)
    this.type = 'slider'
    this.sliderOrientation = options.sliderOrientation || 'horizontal'
    this.sliderSteps = options.sliderSteps || 1
    this.sliderValue = options.sliderValue || 0
  }
  _takeAction() {
    if (this.target.tagName.toLowerCase() === 'input') {
      // If the slider is an input element, set the value directly
      this.target.value = this.sliderValue
      // Need to dispatch both input and change events to trigger the slider
      // to update depending on which event it listens to
      this.target.dispatchEvent(new Event('input', { bubbles: true }))
      this.target.dispatchEvent(new Event('change', { bubbles: true }))
    } else {
      this.target.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          clientX: this.clickPosition.length === 2 ? this.clickPosition[0] : 0,
          clientY: this.clickPosition.length === 2 ? this.clickPosition[1] : 0,
        })
      )
      this.target.dispatchEvent(
        new MouseEvent('mouseup', {
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
