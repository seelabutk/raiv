<template>
  <div class="controls">
    <div class="recording-controls">
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
    </div>

    <InteractionToolbar v-if="!props.store.recording" :store="props.store" />

    <ActionMap
      ref="actionMapComponent"
      v-if="!props.store.recording"
      :store="props.store"
    />

    <div
      v-if="props.store.actionMap.value.root.frameCount > 1"
      class="capture-settings"
    >
      <p>
        {{ props.store.actionMap.value.root.frameCount }} frames will be
        captured.
      </p>

      <div>
        <label>Server Location</label>

        <select
          :value="props.store.serverScheme.value"
          @change="
            (event) => props.store.set('serverScheme', event.target.value)
          "
        >
          <option>http</option>
          <option>https</option>
        </select>

        <span>://</span>

        <input
          type="text"
          :value="props.store.serverAddress.value"
          @input="
            (event) => props.store.set('serverAddress', event.target.value)
          "
        />

        <span>:</span>

        <input
          type="text"
          :value="props.store.serverPort.value"
          @input="(event) => props.store.set('serverPort', event.target.value)"
        />
      </div>

      <div>
        <label class="input">
          Video Name
          <input
            type="text"
            :value="props.store.videoName.value"
            @input="(event) => props.store.set('videoName', event.target.value)"
          />
        </label>
      </div>

      <button
        type="button"
        :disabled="props.store.recording.value"
        @click="capture"
      >
        Capture
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import throttle from 'lodash.throttle'

import ActionMap from '@/components/ActionMap'
import InteractionToolbar from '@/components/InteractionToolbar'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

const actionMapComponent = ref(null)

const recordPauseIcon = computed(() =>
  props.store.recording.value && !props.store.paused.value
    ? 'fa-solid fa-pause'
    : 'fa-solid fa-circle'
)

function onClick(event) {
  const raivWidget = document.querySelector('#raiv')
  const target = event.target

  // TODO: Is there a better way to determine if an event has bubbled besides pointerId?
  if (!raivWidget.contains(target) && event.pointerId !== -1) {
    target.classList.add('raiv-selected')

    props.store.actionMap.value.add(target, event)
    actionMapComponent.value.render()
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
  const serverLocation = `${props.store.serverScheme.value}://${props.store.serverAddress.value}:${props.store.serverPort.value}`

  props.store.actionMap.value.capture(
    serverLocation,
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
  font-size: 1.5em;
  outline: 0;
  padding: 0 0.25em;
}

div:not(:last-child) {
  margin-bottom: 2em;
}

.recording-controls button {
  height: 1.75em;
  width: 1.75em;
}

.recording-controls button:not(:last-child) {
  margin-right: 1em;
}

.capture-settings div {
  margin-bottom: 1em;
}

.capture-settings label {
  margin-right: 0.25em;
}
</style>
