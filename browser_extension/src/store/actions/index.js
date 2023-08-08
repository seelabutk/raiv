import BaseAction from './BaseAction.js'
import Click from './Click.js'
import Hover from './Hover.js'
import Toggle from './Toggle.js'
import Slider from './Slider.js'

function getNewAction(parent, target, boundingBox, options) {
  switch (options.type) {
    case 'click':
      return new Click(parent, target, boundingBox, options)
    case 'hover':
      return new Hover(parent, target, boundingBox, options)
    case 'toggle':
    case 'toggle-off':
      return new Toggle(parent, target, boundingBox, options)
    case 'slider':
      return new Slider(parent, target, boundingBox, options)
    default:
      return new BaseAction(parent, target, boundingBox, options)
  }
}

function copyAction(action) {
  const parent = action.parent
  const target = action.target
  const boundingBox = action.boundingBox
  const newAction = getNewAction(parent, target, boundingBox, {
    type: action.type,
  })
  newAction.boundingBox = action.boundingBox
  newAction.canvasRanges = action.canvasRanges
  newAction.clickPosition = action.clickPosition
  newAction.frameCount = action.canvasRanges[0] * action.canvasRanges[1]
  newAction.manualCapture = action.manualCapture
  newAction.scrollPosition = action.scrollPosition
  newAction.waitTime = action.waitTime
  newAction.independent = action.independent || false

  switch (action.type) {
    case 'click':
    case 'hover':
    case 'toggle':
    case 'toggle-off':
      break
    case 'slider':
      newAction.sliderOrientation = action.sliderOrientation || 'horizontal'
      newAction.sliderValue = action.sliderValue || 0
      newAction.sliderSteps = action.sliderSteps || 1
  }

  return newAction
}

export { getNewAction, copyAction, BaseAction, Click, Hover, Toggle }
