import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTrash,
  faDownload,
  faMagnifyingGlass,
  faSort,
  faGrip,
  faArrowUp,
  faArrowDown,
  faCaretDown,
  faBars,
  faX,
} from '@fortawesome/free-solid-svg-icons'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import VueTippy from 'vue-tippy'

import App from '@/App.vue'
import GalleryPage from '@/pages/GalleryPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import PlayerPage from '@/pages/PlayerPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'

library.add(
  faTrash,
  faDownload,
  faMagnifyingGlass,
  faSort,
  faArrowDown,
  faArrowUp,
  faGrip,
  faCaretDown,
  faBars,
  faX
)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: GalleryPage },
    { path: '/account/login', component: LoginPage },
    { path: '/account/signup', component: RegisterPage },
    { path: '/player/:id', component: PlayerPage },
    { path: '/player/:id/:frameNo', component: PlayerPage },
  ],
})

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(vuetify)
app.use(VueTippy, {
  defaultProps: {
    placement: 'bottom',
    arrow: true,
    inlinePositioning: true,
    zIndex: 9999999,
  },
})
app.mount('#app')
