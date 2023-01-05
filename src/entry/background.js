/* global chrome */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'raiv') {
    let serverLocation = ''
    let videoId = ''

    port.onMessage.addListener((message) => {
      if (message.serverLocation) {
        serverLocation = message.serverLocation.endsWith('/')
          ? message.serverLocation
          : `${message.serverLocation}/`

        fetch(`${serverLocation}video/`, {
          body: JSON.stringify({
            actionMap: Object.assign(
              {
                name: message.videoName,
              },
              message.actionMap
            ),
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
          .then((response) => response.json())
          .then((data) => {
            videoId = data
            port.postMessage({ ready: true })
          })
      } else if (message.capture) {
        chrome.tabs.captureVisibleTab({ format: 'png' }).then((image) => {
          fetch(`${serverLocation}frame/`, {
            body: JSON.stringify({
              frame: image,
              position: message.position,
              video: videoId,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })
        })
      }
    })
  }
})

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    files: ['/recorder.js'],
    target: { tabId: tab.id },
  })
})
