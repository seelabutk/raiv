/* global chrome */
import { reactive, watch } from 'vue'

export default class ServiceWorker {
  constructor() {
    const storageObj = localStorage.getItem('store')

    this.store =
      storageObj === null
        ? reactive({
            paused: false,
            recording: false,
          })
        : reactive(JSON.parse(storageObj))

    watch(this.store, () => {
      localStorage.setItem('store', JSON.stringify(this.store))
    })
  }

  sendMessage(obj) {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, obj)
      }
    )
  }

  startRecording() {
    this.store.paused = false
    this.store.recording = true

    this.sendMessage({
      recording: true,
    })
  }

  stopRecording() {
    this.store.paused = false
    this.store.recording = false

    this.sendMessage({
      recording: false,
    })
  }
}
