/* global chrome */

chrome.runtime.onMessage.addListener((message) => {
  if (message.recording) {
    console.log('start')
  } else {
    console.log('stop')
  }
})
