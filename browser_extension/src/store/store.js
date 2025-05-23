import { ref, watch } from 'vue'

import ActionMap from '@/store/ActionMap'

export default class Store {
  constructor() {
    this.actionMap = ref(new ActionMap())
    this.apiKey = ref('')
    this.username = ref('')
    this.groupName = ref('')
    this.isPublic = ref(false)
    this.paused = ref(false)
    this.recording = ref(false)
    this.serverAddress = ref('localhost')
    this.serverPort = ref('80')
    this.serverScheme = ref('http')
    this.videoName = ref('')
    this.recordingUrl = ref('')
    this.load()

    watch(
      [
        this.apiKey,
        this.username,
        this.groupName,
        this.isPublic,
        this.paused,
        this.recording,
        this.serverAddress,
        this.serverPort,
        this.serverScheme,
        this.videoName,
        this.recordingUrl,
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
    // NOTE: this.serverX, this.videoName, and this.apiKey are intentionally omitted. Presumably, someone capturing
    // multiple sessions would want to reuse these in most cases.

    this.save()
  }

  load() {
    const storageString = localStorage.getItem('raiv-store')
    if (storageString !== null) {
      const storageObj = JSON.parse(storageString)

      this.apiKey.value = storageObj.apiKey
      this.username.value = storageObj.username
      this.groupName.value = storageObj.groupName
      this.isPublic.value = storageObj.isPublic
      this.paused.value = storageObj.paused
      this.recording.value = storageObj.recording
      this.serverAddress.value = storageObj.serverAddress
      this.serverPort.value = storageObj.serverPort
      this.serverScheme.value = storageObj.serverScheme
      this.videoName.value = storageObj.videoName
      this.recordingUrl.value = storageObj.recordingUrl
      if (this.recordingUrl.value === location.href) {
        this.actionMap.value.load(storageObj)
      } else {
        this.reset()
      }
    }
  }

  save() {
    localStorage.setItem(
      'raiv-store',
      JSON.stringify(
        {
          actions: this.actionMap.value.root.children,
          independentActions: this.actionMap.value.independentActions,
          apiKey: this.apiKey.value,
          username: this.username.value,
          groupName: this.groupName.value,
          isPublic: this.isPublic.value,
          paused: this.paused.value,
          recording: this.recording.value,
          serverAddress: this.serverAddress.value,
          serverPort: this.serverPort.value,
          serverScheme: this.serverScheme.value,
          videoName: this.videoName.value,
          recordingUrl: location.href,
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
