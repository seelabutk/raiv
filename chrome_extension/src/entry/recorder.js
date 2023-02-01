import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircle, faPause, faStop } from '@fortawesome/free-solid-svg-icons'

import App from '@/views/RecorderView'

library.add(faCircle, faPause, faStop)

const recorder = document.createElement('div')
recorder.id = 'raiv'

document.body.insertBefore(recorder, document.body.firstChild)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#raiv')
