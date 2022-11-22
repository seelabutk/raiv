import { ref, watch } from 'vue'

export default class Store {
  constructor() {
    // NOTE: if we need to communicate with the service worker, it would be nice to pass in the port for messages to this method
    this.actionMap = ref({
      action: null,
      children: [],
      target: null,
    })
    this.lastAction = null
    this.paused = ref(false)
    this.recording = ref(false)

    const storageString = localStorage.getItem('store')
    if (storageString !== null) {
      const storageObj = JSON.parse(storageString)

      this.set('actionMap', storageObj.actionMap)
      this.set('paused', storageObj.paused)
      this.set('recording', storageObj.recording)
    }

    watch([this.actionMap, this.paused, this.recording], () => {
      localStorage.setItem(
        'store',
        JSON.stringify({
          actionMap: this.actionMap.value,
          paused: this.paused.value,
          recording: this.recording.value,
        })
      )

      // TODO: send message to service worker with updated object???
    })
  }

  // Returns the parent of action and its index in parent's children array for
  // easy removal from this.actionMap
  _findAction(node, action) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index]

      if (child.target === action.target) {
        return [node, index]
      }

      const result = this._findAction(child, action)
      if (result !== null) {
        return result
      }
    }

    return null
  }

  // Returns true if the action is already in this.actionMap
  findAction(action) {
    return this._findAction(this.actionMap.value, action) !== null
  }

  addAction(action) {
    action.children = []

    if (this.lastAction === null) {
      this.actionMap.value.children.push(action)
    } else {
      // We can't add the new action directly via this.lastAction since that won't trigger this.actionMap's watchers/computeds.
      const searchResult = this._findAction(
        this.actionMap.value,
        this.lastAction
      )
      const parent = searchResult[0]
      const index = searchResult[1]

      parent.children[index].children.push(action)
    }

    this.lastAction = action
  }

  removeAction(action) {
    const searchResult = this._findAction(this.actionMap.value, action)

    if (searchResult !== null) {
      const parent = searchResult[0]
      const index = searchResult[1]

      if (this.lastAction.target === action.target) {
        // If the parent of the removed action is the root, then we want to set this.lastAction to null so that the next addAction call works.
        if (parent !== this.actionMap.value) {
          this.lastAction = parent
        } else {
          this.lastAction = null
        }
      }

      return parent.children.splice(index, 1)
    }

    return null
  }

  reset() {
    this.actionMap.value = {
      action: null,
      children: [],
      target: null,
    }
    this.lastAction = null
    this.paused.value = false
    this.recording.value = false
  }

  set(key, value) {
    this[key].value = value
  }
}
