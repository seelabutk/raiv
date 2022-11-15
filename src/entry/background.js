/* global chrome */
import { reactive, watch } from 'vue'

export default class ServiceWorker {
  constructor(store) {
    this.store = store
  }

  static create() {
    const storageObj = localStorage.getItem('store')

    const store =
      storageObj === null
        ? reactive({
            paused: false,
            recording: false,
          })
        : reactive(JSON.parse(storageObj))

    watch(store, () => {
      localStorage.setItem('store', JSON.stringify(store))
    })

    return new ServiceWorker(store)
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
