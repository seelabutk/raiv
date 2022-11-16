/* global chrome */
import { reactive, watch } from 'vue'

export default class ServiceWorker {
  constructor() {
    const storageObj = localStorage.getItem('store')

    if (storageObj === null) {
      this.initStore()
    } else {
      this.store = reactive(JSON.parse(storageObj))
    }

    watch(this.store, () => {
      localStorage.setItem('store', JSON.stringify(this.store))
    })

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        this.port = chrome.tabs.connect(tabs[0].id, { name: 'raiv' })

        this.port.onMessage.addListener((message) => {
          const element = message.target

          const index = this.store.actionMap.findIndex(
            (obj) => obj.target === element
          )

          if (index === -1) {
            this.store.actionMap.push(message)
          } else {
            this.store.actionMap.splice(index, 1)
          }
        })
      }
    )
  }

  clear() {
    this.store.actionMap = []
    this.port.postMessage({
      clear: true,
    })
  }

  initStore() {
    this.store = reactive({
      actionMap: [], // TODO: make this an actual tree
      paused: false,
      recording: false,
    })
  }

  sendMessage(obj) {
    if (this.port !== null) {
      this.port.postMessage(obj)
    }
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
