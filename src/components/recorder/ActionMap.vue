<template>
  <div>{{ props.store }}</div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})
</script>
