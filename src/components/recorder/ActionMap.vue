<template>
  <ul>
    <li v-for="(action, index) in actions" :key="action.target">
      <span>{{ index + 1 }}. {{ action.target.tagName.toLowerCase() }}</span>
      <span v-if="action.target.id !== ''">#{{ action.target.id }}</span>
      <span v-if="getClasses(action.target).length > 0"
        >.{{ getClasses(action.target).join('.') }}
      </span>

      <select v-model="action.action">
        <option value="click">Click</option>
        <option value="hover">Hover</option>
      </select>
    </li>
  </ul>
</template>

<script setup>
import { computed, defineProps } from 'vue'

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

function getClasses(element) {
  return [...element.classList].filter(
    (className) => !className.startsWith('raiv')
  )
}
</script>
