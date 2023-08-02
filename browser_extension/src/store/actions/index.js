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

export { getNewAction, BaseAction, Click, Hover, Toggle }
