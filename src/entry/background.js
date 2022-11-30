/* global chrome */
export default class ServiceWorker {
  constructor() {}

  start() {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        this.port = chrome.tabs.connect(tabs[0].id, { name: 'raiv' })
        this.port.postMessage({ launch: true })
      }
    )
  }
}
