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

.raiv-selected {
  filter: invert(63%) sepia(53%) saturate(2990%) hue-rotate(75deg)
    brightness(111%) contrast(134%);
}
</style>
