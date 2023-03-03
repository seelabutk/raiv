<template>
  <div>
    <button type="button" :disabled="actionMap.frameCount < 2" @click="open">
      View Action Map
    </button>

    <dialog class="action-map-dialog">
      <button class="close-btn" type="button" @click="close">
        <font-awesome-icon icon="fa-solid fa-xmark" class="fa-2x" />
      </button>
    </dialog>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { defineProps } from 'vue'

const props = defineProps({
  actionMap: {
    required: true,
    type: Object,
  },
})

console.log(d3.hierarchy(props.actionMap.root))

function open() {
  document.querySelector('.action-map-dialog').show()
}

function close() {
  document.querySelector('.action-map-dialog').close()
}
</script>

<style scoped>
.action-map-dialog {
  height: 600px; /* TODO: fix */
  position: fixed;
  margin-right: 1em;
  top: 1em;
  width: 400px; /* TODO: fix */
  z-index: 1001;
}

.close-btn {
  position: absolute;
  right: 0.5em;
  top: 0.5em;
}
</style>
