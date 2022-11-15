/* global chrome */
const selectedElements = []
const elementBorders = []

function highlight(element, value) {
  if (value) {
    element.style.border = '1px solid green'
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
  } else {
    const index = selectedElements.indexOf(element)

    highlight(element, false)

    selectedElements.splice(index, 1)
    elementBorders.splice(index, 1)
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.recording) {
    document.addEventListener('click', onClick, true)
  } else {
    document.removeEventListener('click', onClick, true)

    selectedElements.forEach((element) => {
      highlight(element, false)
    })

    selectedElements.splice(0, selectedElements.length)
    elementBorders.splice(0, elementBorders.length)
  }
})
