<template>
  <div>
    <div class="controls">
      <button type="button" @click="recordPause">
        <font-awesome-icon :icon="recordPauseIcon" />
      </button>

      <button type="button" :disabled="!store.recording" @click="stopRecording">
        <font-awesome-icon icon="fa-solid fa-stop" />
      </button>
    </div>

    <ul class="selections">
      <li v-for="entry in store.actionMap" :key="entry">{{ entry }}</li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import throttle from 'lodash.throttle'
import store from '@/store/store'

const recordPauseIcon = computed(() =>
  store.recording && !store.paused ? 'fa-solid fa-pause' : 'fa-solid fa-play'
)

function onClick(event) {
  event.preventDefault() // NOTE: This may be a terrible idea. Will this work with menus?

  const raivWidget = document.querySelector('#raiv')
  const target = event.target

  if (!raivWidget.contains(target)) {
    const index = store.actionMap.findIndex((entry) => entry.target === target)
    if (index === -1) {
      store.actionMap.push({
        target,
        action: 'click',
      })

      target.classList.add('raiv-selected')
    } else {
      store.actionMap.splice(index, 1)

      target.classList.remove('raiv-selected')
    }
  }
}

let hoveredElement = null
function onMousemove(event) {
  const raivWidget = document.querySelector('#raiv')
  const target = event.target

  if (!raivWidget.contains(target) && hoveredElement !== target) {
    if (hoveredElement !== null) {
      hoveredElement.classList.remove('raiv-hovered')
    }
    target.classList.add('raiv-hovered')

    hoveredElement = target
  }
}
const throttledMousemove = throttle(onMousemove, 100)

function recordPause() {
  if (!store.recording) {
    store.recording = true
    document.addEventListener('click', onClick, true)
    document.addEventListener('mousemove', throttledMousemove, true)
  } else if (!store.paused) {
    store.paused = true
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('mousemove', throttledMousemove, true)
  } else {
    store.paused = false
    document.addEventListener('click', onClick, true)
    document.addEventListener('mousemove', throttledMousemove, true)
  }
}

function stopRecording() {
  document.removeEventListener('click', onClick, true)
  document.removeEventListener('mousemove', throttledMousemove, true)

  if (hoveredElement !== null) {
    hoveredElement.classList.remove('raiv-hovered')
  }
  store.actionMap.forEach((entry) => {
    entry.target.classList.remove('raiv-selected')
  })

  store.actionMap = []
  store.paused = false
  store.recording = false
}
</script>

<style scoped>
button {
  cursor: pointer;
  font-size: 1.5em;
  height: 1.75em;
  outline: 0;
  padding: 0.25em;
  width: 1.75em;
}

button:not(:last-child) {
  margin-right: 1em;
}
</style>
