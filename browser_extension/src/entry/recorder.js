import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircle,
  faCog,
  faGrip,
  faPause,
  faStop,
  faXmark,
  faArrowRotateLeft,
  faTrash,
  faPen,
} from '@fortawesome/free-solid-svg-icons'
import drag from 'v-drag'
import VueTippy from 'vue-tippy'

import App from '@/views/RecorderView'

library.add(
  faCircle,
  faCog,
  faGrip,
  faPause,
  faStop,
  faXmark,
  faArrowRotateLeft,
  faTrash,
  faPen
)

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
  app.use(drag)
  app.use(VueTippy, {
    defaultProps: {
      placement: 'bottom',
      arrow: true,
      inlinePositioning: true,
      zIndex: 9999999,
    },
  })
  app.mount('#raiv')
  recorder.style.opacity = 100
}

toggleUI()
