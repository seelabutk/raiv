/* global chrome */
const selectedElements = []
const elementBorders = []
let port = null

chrome.runtime.onConnect.addListener((_port) => {
  port = _port

  if (port.name === 'raiv') {
    port.onMessage.addListener((message) => {
      if ('recording' in message) {
        if (message.recording) {
          document.addEventListener('click', onClick, true)
        } else {
          document.removeEventListener('click', onClick, true)
        }

        clearElements()
      }

      if ('clear' in message && message.clear) {
        clearElements()
      }
    })
  }
})

function clearElements() {
  selectedElements.forEach((element) => {
    highlight(element, false)
  })

  selectedElements.splice(0, selectedElements.length)
  elementBorders.splice(0, elementBorders.length)
}

function sendMessage(obj) {
  if (port !== null) {
    port.postMessage(obj)
  }
}

function highlight(element, value) {
  if (value) {
    element.style.border = '4px solid green'
  } else {
    const index = selectedElements.indexOf(element)

    element.style.border = elementBorders[index]
  }
}

function onClick(event) {
  event.preventDefault()

  const element = event.target
  if (!selectedElements.includes(element)) {
    selectedElements.push(element)
    elementBorders.push(element.style.border)

    highlight(element, true)

    sendMessage({
      action: 'click',
      target: element,
    })
  } else {
    const index = selectedElements.indexOf(element)

    highlight(element, false)

    selectedElements.splice(index, 1)
    elementBorders.splice(index, 1)

    sendMessage({
      delete: true,
      target: element,
    })
  }
}
