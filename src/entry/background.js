import { reactive } from 'vue'

let store = null

export default {
  create: () => {
    store = reactive({
      recording: false,
    })

    return store
  },
  read: () => {
    store = reactive(JSON.parse(localStorage.getItem('store')))

    return store
  },
  update: (key, value) => {
    store[key] = value
    localStorage.setItem('store', JSON.stringify(store))
  },
}
