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
          const request = {
            frame: image,
            position: message.position,
            scrollPosition: message.scroll,
            video: videoId,
          }

          if (message.scrollOffset) {
            request.scrollOffset = message.scrollOffset
          }

          fetch(`${serverLocation}frame/`, {
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          }).then(() => {
            port.postMessage({ captured: true })
          })
        })
      } else if (message.complete) {
        fetch(`${serverLocation}video/${videoId}/`, {
          body: JSON.stringify({
            complete: true,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
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
