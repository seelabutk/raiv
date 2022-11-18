/* global chrome */
import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'

import App from '@/views/RecorderView'

library.add(faPause, faPlay, faStop)

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'raiv') {
    port.onMessage.addListener((message) => {
      if (message.launch) {
        const recorder = document.createElement('div')
        recorder.id = 'raiv'

        document.body.insertBefore(recorder, document.body.firstChild)

        const app = createApp(App)
        app.component('font-awesome-icon', FontAwesomeIcon)
        app.mount('#raiv')
      }
    })
  }
})
