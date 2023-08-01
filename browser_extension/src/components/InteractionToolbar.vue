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
        <option value="slider">Slider</option>
      </select>
    </label>
    <br />
    <label>
      Independent Action:
      <input type="checkbox" v-model="actionMap.independentAction" />
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
