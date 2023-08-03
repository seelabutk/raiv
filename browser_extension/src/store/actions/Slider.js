import BaseAction from './BaseAction.js'

export default class Slider extends BaseAction {
  constructor(parent, target, boundingBox, options) {
    super(parent, target, boundingBox, options)
    this.type = 'slider'
    this.sliderOrientation = options.sliderOrientation || 'horizontal'
    this.sliderBoundingBox = options.sliderBoundingBox || []
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

  async capture(port, position, root = false, independentActions = undefined) {
    // A slider will have multiple actions, so we need to store each position
    const positions = []

    // Rather than having multiple actions for a single slider action, we
    // will iterate in the capture method
    const tagName = this.target.tagName.toLowerCase()
    const [left, top, right, bottom] = this.boundingBox
    const height = bottom - top
    const width = right - left
    const offset =
      this.sliderOrientation === 'horizontal'
        ? width / this.sliderSteps
        : height / this.sliderSteps

    // if the tagName is an input we need to set the value directly
    const deltaValue =
      tagName === 'input' ? this.target.max - this.target.min : 0
    const minValue = Number(this.target.min || 0)

    for (let i = 0; i < this.sliderSteps; i++) {
      // Store the position index for the slider step
      positions.push(position)

      // Calculate the bounding box for the slider step
      this.sliderBoundingBox = [
        left + (this.sliderOrientation === 'horizontal' ? offset * i : 0),
        top + (this.sliderOrientation === 'vertical' ? offset * i : 0),
        left +
        (this.sliderOrientation === 'horizontal' ? offset * (i + 1) : width),
        top +
        (this.sliderOrientation === 'vertical' ? offset * (i + 1) : height),
      ]

      // Calculate the center of the bounding box for the slider step
      this.clickPosition = [
        left +
        (this.sliderOrientation === 'horizontal'
          ? offset * (i + 0.5)
          : width / 2),
        top +
        (this.sliderOrientation === 'vertical'
          ? offset * (i + 0.5)
          : height / 2),
      ]

      // Calculate the value for the slider step
      this.sliderValue = minValue + deltaValue * ((i + 0.5) / this.sliderSteps)

      // Capture the action
      position = await this._capture(port, position, root, independentActions)
    }

    this.position = positions
    return position
  }

  _revertActionPreChildren() {
    // This is a stub method that should be overridden by subclasses
  }

  _revertActionPostChildren() {
    // This is a stub method that should be overridden by subclasses
  }
}
