import { ref, watch } from 'vue'

import ActionMap from '@/store/ActionMap'

export default class Store {
  constructor() {
    this.actionMap = ref(new ActionMap())
    this.paused = ref(false)
    this.recording = ref(false)
    this.serverAddress = ref('localhost')
    this.serverPort = ref('80')
    this.serverScheme = ref('http')
    this.videoName = ref('')

    this.load()

    watch(
      [
        this.paused,
        this.recording,
        this.serverAddress,
        this.serverPort,
        this.serverScheme,
        this.videoName,
      ],
      () => {
        this.save()
      }
    )
  }

  reset() {
    this.actionMap.value.reset()

    this.paused.value = false
    this.recording.value = false
    // NOTE: this.serverX and this.videoName are intentionally omitted. Presumably, someone capturing
    // multiple sessions would want to reuse these in most cases.

    this.save()
  }

  load() {
    const storageString = localStorage.getItem('store')
    if (storageString !== null) {
      const storageObj = JSON.parse(storageString)

      this.paused.value = storageObj.paused
      this.recording.value = storageObj.recording
      this.serverAddress.value = storageObj.serverAddress
      this.serverPort.value = storageObj.serverPort
      this.serverScheme.value = storageObj.serverScheme
      this.videoName.value = storageObj.videoName

      this.actionMap.value.load(storageObj)
    }
  }

  save() {
    localStorage.setItem(
      'store',
      JSON.stringify(
        {
          actions: this.actionMap.value.root.children,
          paused: this.paused.value,
          recording: this.recording.value,
          serverAddress: this.serverAddress.value,
          serverPort: this.serverPort.value,
          serverScheme: this.serverScheme.value,
          videoName: this.videoName.value,
        },
        (key, value) => {
          // Ignoring the parent pointer is necessary to avoid a circular structure.
          // The parent is recreated on load, so it doesn't need to be saved.
          if (key === 'parent') {
            return
          }

          return value
        }
      )
    )
  }

  set(key, value) {
    this[key].value = value
  }
}
