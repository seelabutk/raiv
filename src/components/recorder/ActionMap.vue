<template>
  <div>
    <ul>
      <li v-for="(action, index) in actions" :key="action.target">
        <span v-if="isElement(action.target)">
          {{ index + 1 }}. {{ action.target.tagName.toLowerCase() }}
          <span v-if="action.target.id !== ''">#{{ action.target.id }}</span>
          <span v-if="getClasses(action.target).length > 0"
            >.{{ getClasses(action.target).join('.') }}
          </span>
        </span>

        <select v-model="action.action">
          <option value="click">Click</option>
          <option value="hover">Hover</option>
        </select>
      </li>
    </ul>

    <div v-if="actions.length > 0">
      <p>{{ actions.length + 1 }} frames will be captured.</p>

      <label class="input">
        Server Location
        <input
          :value="props.store.server.value"
          @input="(event) => props.store.set('server', event.target.value)"
          type="text"
        />
      </label>

      <label class="input">
        Video Name
        <input
          :value="props.store.videoName.value"
          @input="(event) => props.store.set('videoName', event.target.value)"
          type="text"
        />
      </label>

      <button :disabled="props.store.recording.value" @click="capture">
        Capture
      </button>
    </div>
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

function isElement(element) {
  return element instanceof Element
}

function capture() {
  props.store.actionMap.value.capture(
    props.store.server.value,
    props.store.videoName.value
  )
  props.store.reset()
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
