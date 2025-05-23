/* global chrome */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'raiv') {
    let apiKey = ''
    let serverLocation = ''
    let videoId = ''

    port.onMessage.addListener((message) => {
      if (message.serverLocation) {
        serverLocation = message.serverLocation.endsWith('/')
          ? message.serverLocation
          : `${message.serverLocation}/`

        apiKey = message.apiKey

        fetch(`${serverLocation}video/`, {
          body: JSON.stringify({
            apiKey,
            actionMap: Object.assign(
              {
                name: message.videoName,
                username: message.username,
                groupName: message.groupName,
                isPublic: message.isPublic
              },
              message.actionMap
            ),
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        }).then((response) => {
          if (response.status >= 200 && response.status <= 299) {
            response.json().then((data) => {
              videoId = data
              port.postMessage({ ready: true })
            })
          } else {
            port.postMessage({ failed: true })
          }
        })
      } else if (message.capture) {
        const request = {
          apiKey,
          frame: message.image,
          position: message.position,
          scrollPosition: message.scroll,
          scrollOffset: 0,
          video: videoId,
        }

        fetch(`${serverLocation}frame/`, {
          body: JSON.stringify(request),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        }).then(() => {
          port.postMessage({ captured: true })
        })
      } else if (message.complete) {
        fetch(`${serverLocation}video/${videoId}/`, {
          body: JSON.stringify({
            apiKey,
            complete: true,
            actionMap: message.actionMap,
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
