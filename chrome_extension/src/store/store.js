import { ref, watch } from 'vue'

import ActionMap from '@/store/ActionMap'

export default class Store {
  constructor() {
    this.actionMap = ref(new ActionMap())
    this.paused = ref(false)
    this.recording = ref(false)
    this.server = ref('')
    this.videoName = ref('')

    this.load()

    watch([this.paused, this.recording, this.server, this.videoName], () => {
      this.save()
    })
  }

  reset() {
    this.actionMap.value = new ActionMap()
    this.paused.value = false
    this.recording.value = false
    // NOTE: this.server and this.videoName are intentionally omitted. Presumably, someone capturing
    // multiple sessions would want to reuse these in most cases.

    this.save()
  }

  load() {
    const storageString = localStorage.getItem('store')
    if (storageString !== null) {
      const storageObj = JSON.parse(storageString)

      this.paused.value = storageObj.paused
      this.recording.value = storageObj.recording
      this.server.value = storageObj.server
      this.videoName.value = storageObj.videoName

      this.actionMap.value.load(storageObj)
    }
  }

  save() {
    localStorage.setItem(
      'store',
      JSON.stringify({
        actions: this.actionMap.value.root.children,
        paused: this.paused.value,
        recording: this.recording.value,
        server: this.server.value,
        videoName: this.videoName.value,
      })
    )
  }

  set(key, value) {
    this[key].value = value
  }
}
