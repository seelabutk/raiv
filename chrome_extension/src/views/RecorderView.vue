<template>
  <div>
    <RecorderControls :store="store" />
  </div>
</template>

<script setup>
import RecorderControls from '@/components/recorder/RecorderControls'
import Store from '@/store/store'

const store = new Store()
</script>

<style>
#raiv {
  background: white;
  border: 1px solid black;
  border-radius: 4px;
  padding: 1em;
  position: absolute;
  right: 1em;
  top: 1em;
  z-index: 1000;
}

.raiv-hovered {
  border: 2px solid #0000ff;
}

.raiv-selected {
  border: 2px solid #00ff00 !important;
}
</style>
