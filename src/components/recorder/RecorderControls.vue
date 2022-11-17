<template>
  <div>
    <button type="button" @click="recordPause">
      <font-awesome-icon :icon="recordPauseIcon" />
      {{ recordPauseText }}
    </button>

    <button
      type="button"
      :disabled="!store.recording"
      @click="props.worker.stopRecording"
    >
      <font-awesome-icon icon="fa-solid fa-circle-stop" />
      Stop Recording
    </button>

    <button type="button" @click="props.worker.clear">Clear</button>
  </div>
</template>

<style scoped>
button:not(:first-child) {
  margin-left: 1em;
}
</style>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  worker: {
    required: true,
    type: Object,
  },
})

const store = computed(() => props.worker.store)

const recordPauseIcon = computed(() =>
  store.value.recording ? 'fa-solid fa-circle-pause' : 'fa-solid fa-circle'
)

const recordPauseText = computed(() => {
  if (!store.value.recording) {
    return 'Start recording'
  }
  if (!store.value.paused) {
    return 'Pause recording'
  }
  return 'Resume recording'
})

function recordPause() {
  if (!store.value.recording) {
    props.worker.startRecording()
  } else if (!store.value.paused) {
    store.value.paused = true
  } else {
    store.value.paused = false
  }
}
</script>
