<template>
  <div>
    <RecorderControls />
  </div>
</template>

<script setup>
import RecorderControls from '@/components/recorder/RecorderControls'
</script>

<style>
#raiv {
  border: 1px solid black;
  border-radius: 4px;
  padding: 1em;
  position: absolute;
  right: 1em;
  top: 1em;
}

.raiv-hovered {
  border: 2px solid #0000ff;
}

.raiv-selected {
  border: 2px solid #00ff00 !important;
}
</style>
