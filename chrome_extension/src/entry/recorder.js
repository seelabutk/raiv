import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircle,
  faPause,
  faStop,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

import App from '@/views/RecorderView'

library.add(faCircle, faPause, faStop, faXmark)

function toggleUI() {
  const raiv = document.getElementById('raiv')

  // If raiv is already initialized, hide or show it. Don't reinit.
  if (raiv) {
    if (raiv.hidden) {
      raiv.hidden = false
      // 100ms wait to let Chrome catch up if the user click too quickly
      window.setTimeout(() => {
        window.requestAnimationFrame(() => {
          raiv.style.opacity = 100
        })
      }, 100)
    } else {
      raiv.style.opacity = 0

      // Hide after animation is finished.
      window.setTimeout(() => {
        window.requestAnimationFrame(() => {
          raiv.hidden = true
        })
      }, 450)
    }

    return
  }

  const recorder = document.createElement('div')
  recorder.id = 'raiv'

  document.body.appendChild(recorder)

  const app = createApp(App)
  app.component('font-awesome-icon', FontAwesomeIcon)
  app.mount('#raiv')
  recorder.style.opacity = 100
}

toggleUI()
