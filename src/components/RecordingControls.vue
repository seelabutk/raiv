<template>
  <div>
    <button type="button" @click="recordPause">
      <font-awesome-icon :icon="recordPauseIcon" />
      {{ recordPauseText }}
    </button>
    <button type="button" :disabled="!recording" @click="stopRecording">
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
/* global chrome */
import { computed, ref } from 'vue'

const recording = ref(false)
const paused = ref(false)

const recordPauseIcon = computed(() =>
  recording.value ? 'fa-solid fa-circle-pause' : 'fa-solid fa-circle'
)
const recordPauseText = computed(() => {
  if (!recording.value) {
    return 'Start recording'
  }

  if (!paused.value) {
    return 'Pause recording'
  }

  return 'Resume recording'
})

function recordPause() {
  if (!recording.value) {
    recording.value = true
    startRecording()
  } else if (!paused.value) {
    paused.value = true
  } else {
    paused.value = false
  }
}

function startRecording() {
  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const currentTab = tabs[0]

    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      files: ['js/recorder.js'],
    })
  })
}

function stopRecording() {
  recording.value = false
  paused.value = false
}
</script>
