<template>
  <div>
    <button type="button" @[click]="recordPause">
      <font-awesome-icon :icon="recordPauseIcon" />
      Start Recording
    </button>
    <button type="button" :disabled="recording" @[click]="stopRecording">
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
import { computed, ref } from 'vue'

const recording = ref(false)
const paused = ref(false)

const recordPauseIcon = computed(() =>
  recording.value ? 'fa-solid fa-circle-pause' : 'fa-solid fa-circle'
)

function recordPause() {
  if (recording.value) {
    paused.value = true
  } else {
    paused.value = false
    recording.value = true
  }
}

function stopRecording() {
  paused.value = false
  recording.value = false
}
</script>
