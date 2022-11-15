import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircle,
  faCirclePause,
  faCircleStop,
} from '@fortawesome/free-solid-svg-icons'

import App from '@/views/HomeView'

library.add(faCircle, faCirclePause, faCircleStop)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
