import { reactive, watch } from 'vue'

const storageObj = localStorage.getItem('store')
let store = null

if (storageObj === null) {
  store = reactive({
    actionMap: [],
    paused: false,
    recording: false,
  })
} else {
  store = reactive(JSON.parse(storageObj))
}

watch(store, () => {
  localStorage.setItem('store', JSON.stringify(store))

  // TODO: send message to service worker with updated object???
})

export default store
