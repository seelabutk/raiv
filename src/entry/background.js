/* global chrome */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'raiv') {
    let framePosition = 0
    port.onMessage.addListener((message) => {
      if (message.capture) {
        chrome.tabs.captureVisibleTab({ format: 'png' }).then((image) => {
          chrome.downloads.download({
            filename: `download${framePosition++}.png`,
            url: image,
          })
        })
      }
    })
  }
})
