import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCirclePause,
  faCirclePlay,
  faCircleStop,
} from '@fortawesome/free-solid-svg-icons'

import './assets/main.css'

library.add(faCirclePause, faCirclePlay, faCircleStop)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
