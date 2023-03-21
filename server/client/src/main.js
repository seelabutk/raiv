import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from '@/App.vue'
import GalleryPage from '@/pages/GalleryPage.vue'
import PlayerPage from '@/pages/PlayerPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: GalleryPage },
    { path: '/player/:id', component: PlayerPage },
  ],
})

const app = createApp(App)

app.use(router)
app.mount('#app')
