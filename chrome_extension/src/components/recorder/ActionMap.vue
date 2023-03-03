<template>
  <div>
    <ul>
      <li v-for="(action, index) in visibleActions" :key="action.target">
        <span v-if="isElement(action.target)">
          {{ index + 1 }}. {{ action.target.tagName.toLowerCase() }}
          <span v-if="action.target.id !== ''">#{{ action.target.id }}</span>
          <span v-if="getClasses(action.target).length > 0"
            >.{{ getClasses(action.target).join('.') }}
          </span>
        </span>

        <select v-model="action.action" @change="changeAction(action)">
          <option value="click">Click</option>
          <option value="hover">Hover</option>
          <option value="switch">Switch</option>
        </select>

        <span>Siblings: {{ action.siblings.length }}</span>

        <input
          v-model="action.useSiblings"
          type="checkbox"
          @change="action.toggleSiblings(props.store.actionMap.value)"
        />
      </li>
    </ul>
  </div>
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
  const root = props.store.actionMap.value.root
  const _actions = [...root.children]
  for (let index = 0; index < _actions.length; index++) {
    _actions.push(..._actions[index].children)
  }

  return _actions
})

const visibleActions = computed(() => {
  return actions.value.filter((action) => action.visible)
})

function changeAction(action) {
  if (action.action === 'switch') {
    console.log('do something here')
  }
}

function getClasses(element) {
  return [...element.classList].filter(
    (className) => !className.startsWith('raiv')
  )
}

function isElement(element) {
  return element instanceof Element
}

onMounted(() => {
  if (props.store.recording.value) {
    for (let index = 0; index < actions.value.length; index++) {
      actions.value[index].target.classList.add('raiv-selected')
    }
  }
})
</script>

<style scoped>
li select {
  margin-left: 0.5em;
}

.input {
  display: block;
  margin-bottom: 1em;
}
</style>
