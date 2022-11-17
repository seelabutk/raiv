<template>
  <button @click="props.worker.start">Start RAIV</button>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  worker: {
    required: true,
    type: Object,
  },
})
</script>
