<template>
  <div>
    <button type="button" @click="recordPause">
      <font-awesome-icon :icon="recordPauseIcon" />
      {{ recordPauseText }}
    </button>

    <button
      type="button"
      :disabled="!store.recording"
      @click="worker.stopRecording"
    >
      <font-awesome-icon icon="fa-solid fa-circle-stop" />
      Stop Recording
    </button>
  </div>
</template>

<style scoped>
button:not(:first-child) {
  margin-left: 1em;
}
</style>

<script setup>
import { computed } from 'vue'

import ServiceWorker from '@/entry/background'

const worker = ServiceWorker.create()
const store = worker.store

const recordPauseIcon = computed(() =>
  store.recording ? 'fa-solid fa-circle-pause' : 'fa-solid fa-circle'
)

const recordPauseText = computed(() => {
  if (!store.recording) {
    return 'Start recording'
  }
  if (!store.paused) {
    return 'Pause recording'
  }
  return 'Resume recording'
})

function recordPause() {
  if (!store.recording) {
    worker.startRecording()
  } else if (!store.paused) {
    store.paused = true
  } else {
    store.paused = false
  }
}
</script>
