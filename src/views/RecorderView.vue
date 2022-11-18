<template>
  <div class="raiv-widget">
    <RecorderControls />
  </div>
</template>

<script setup>
import RecorderControls from '@/components/recorder/RecorderControls'
</script>

<style scoped>
.raiv-widget {
  border: 1px solid black;
  border-radius: 4px;
  padding: 1em;
  position: absolute;
  right: 1em;
  top: 1em;
}
</style>
