<template>
  <div class="controls">
    <button type="button" @click="recordPause">
      <font-awesome-icon :icon="recordPauseIcon" />
    </button>

    <button
      type="button"
      :disabled="!props.store.recording.value"
      @click="stopRecording"
    >
      <font-awesome-icon icon="fa-solid fa-stop" />
    </button>

    <ActionMap :action-map="actionMap" />

    <div v-if="actionMap.frameCount > 1">
      <p>{{ actionMap.frameCount }} frames will be captured.</p>

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
import throttle from 'lodash.throttle'

import ActionMap from '@/components/recorder/NewActionMap'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

const actionMap = computed(() => props.store.actionMap.value)

const recordPauseIcon = computed(() =>
  props.store.recording.value && !props.store.paused.value
    ? 'fa-solid fa-pause'
    : 'fa-solid fa-circle'
)

function onClick(event) {
  const raivWidget = document.querySelector('#raiv')
  const target = event.target

  if (!raivWidget.contains(target)) {
    target.classList.add('raiv-selected')

    actionMap.value.add(target, event)
    props.store.save()
  }
}

let hoveredElement = null
function onMousemove(event) {
  const raivWidget = document.querySelector('#raiv')
  const target = event.target

  if (raivWidget.contains(target)) {
    if (hoveredElement !== null) {
      hoveredElement.classList.remove('raiv-hovered')
    }

    hoveredElement = null
  } else if (hoveredElement !== target) {
    if (hoveredElement !== null) {
      hoveredElement.classList.remove('raiv-hovered')
    }
    target.classList.add('raiv-hovered')

    hoveredElement = target
  }
}
const throttledMousemove = throttle(onMousemove, 100)

function recordPause() {
  if (!props.store.recording.value) {
    props.store.reset()
    props.store.set('recording', true)

    document.addEventListener('click', onClick, true)
    document.addEventListener('mousemove', throttledMousemove, true)
  } else if (!props.store.paused.value) {
    props.store.set('paused', true)

    document.removeEventListener('click', onClick, true)
    document.removeEventListener('mousemove', throttledMousemove, true)
  } else {
    props.store.set('paused', false)

    document.addEventListener('click', onClick, true)
    document.addEventListener('mousemove', throttledMousemove, true)
  }
}

function stopRecording() {
  document.removeEventListener('click', onClick, true)
  document.removeEventListener('mousemove', throttledMousemove, true)

  if (hoveredElement !== null) {
    hoveredElement.classList.remove('raiv-hovered')
  }
  document.querySelectorAll('.raiv-selected').forEach((element) => {
    element.classList.remove('raiv-selected')
  })

  props.store.set('recording', false)
  props.store.set('paused', false)
}

function capture() {
  props.store.actionMap.value.capture(
    props.store.server.value,
    props.store.videoName.value
  )
  props.store.reset()
}

onMounted(() => {
  if (props.store.recording.value && !props.store.paused.value) {
    document.addEventListener('click', onClick, true)
    document.addEventListener('mousemove', throttledMousemove, true)
  }
})
</script>

<style scoped>
button {
  cursor: pointer;
  font-size: 1.5em;
  height: 1.75em;
  outline: 0;
  padding: 0.25em;
  width: 1.75em;
}

button:not(:last-child) {
  margin-right: 1em;
}
</style>
