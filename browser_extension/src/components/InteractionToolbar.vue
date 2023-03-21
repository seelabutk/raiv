<template>
  <div>
    <label>
      Interaction type:

      <select
        :value="actionMap.interactionType"
        @change="
          (event) => actionMap.set('interactionType', event.target.value)
        "
      >
        <option value="click">Click</option>
        <option value="hover">Hover</option>
        <option value="toggle">Toggle</option>
      </select>
    </label>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

const actionMap = computed(() => {
  return props.store.actionMap.value
})
</script>
