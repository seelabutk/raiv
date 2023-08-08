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
import VueTippy from 'vue-tippy'

import App from '@/App.vue'
import GalleryPage from '@/pages/GalleryPage.vue'
import PlayerPage from '@/pages/PlayerPage.vue'

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
    { path: '/player/:id', component: PlayerPage },
  ],
})

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(VueTippy, {
  defaultProps: {
    placement: 'bottom',
    arrow: true,
    inlinePositioning: true,
    zIndex: 9999999,
  },
})
app.mount('#app')
