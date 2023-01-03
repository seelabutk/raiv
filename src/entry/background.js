/* global chrome */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'raiv') {
    let framePosition = 0
    let serverLocation = ''
    let videoId = ''

    port.onMessage.addListener((message) => {
      if (message.serverLocation) {
        framePosition = 0
        serverLocation = message.serverLocation.endsWith('/')
          ? message.serverLocation
          : `${message.serverLocation}/`

        fetch(`${serverLocation}video/`, {
          body: JSON.stringify({
            name: message.videoName,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
        // TODO: get the video's resource URI back from the server and store it for frame captures
      } else if (message.capture) {
        chrome.tabs.captureVisibleTab({ format: 'png' }).then((image) => {
          fetch(`${serverLocation}frame/`, {
            body: JSON.stringify({
              frame: image,
              position: framePosition, // TODO: Do we care about this? If we want to sort the frames before encoding then this surely is unimportant.
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
