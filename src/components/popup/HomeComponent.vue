<template>
  <button @click="start">Start RAIV</button>
</template>

<script setup>
/* global chrome */
function start() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { launch: true })
    }
  )
}
</script>
