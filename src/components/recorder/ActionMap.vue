<template>
  <ul>
    <li v-for="(action, index) in actions" :key="action.target">
      <span>{{ index + 1 }}. {{ action.boundingBox }}</span>

      <select v-model="action.action">
        <option value="click">Click</option>
        <option value="hover">Hover</option>
      </select>
    </li>
  </ul>
</template>

<script setup>
import { computed, defineProps, onMounted } from 'vue'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

const actions = computed(() => {
  const root = props.store.actionMap.value
  const _actions = [...root.children]
  for (let index = 0; index < _actions.length; index++) {
    _actions.push(..._actions[index].children)
  }

  return _actions
})

onMounted(() => {
  for (let index = 0; index < actions.value.length; index++) {
    actions.value[index].target.classList.add('raiv-selected')
  }
})
</script>
