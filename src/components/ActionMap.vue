<template>
  <ul>
    <li v-for="action in store.actionMap" :key="action.element">
      {{ action.element }}
    </li>
  </ul>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  worker: {
    required: true,
    type: Object,
  },
})

const store = computed(() => props.worker.store)
</script>
