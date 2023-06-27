<template>
  <div class="control-container" v-drag="'#controls-handle'" v-show="isShown">
    <div id="controls-handle" class="handle">
      <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip" />
    </div>

    <div class="controls">
      <div class="recording-controls">
        <tippy :content="recordPauseTooltipText" content-class="tippy-tooltip">
          <button type="button" @click="recordToggle">
            <font-awesome-icon :icon="recordPauseIcon" />
          </button>
        </tippy>

        <tippy content="Reset Recording">
          <button
            type="button"
            :hidden="props.store.actionMap.value.root.frameCount <= 1"
            @click="resetRecording"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-rotate-left" />
          </button>
        </tippy>
      </div>

      <InteractionToolbar
        :hidden="!props.store.recording.value"
        :store="props.store"
      />

      <ActionMap
        ref="actionMapComponent"
        :hidden="props.store.actionMap.value.root.frameCount <= 1"
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
            @input="
              (event) => props.store.set('serverPort', event.target.value)
            "
          />
        </div>

        <div>
          <label class="input">
            Video Name
            <input
              type="text"
              :value="props.store.videoName.value"
              @input="
                (event) => props.store.set('videoName', event.target.value)
              "
            />
          </label>
        </div>

        <div class="api-key">
          <label>
            API Key
            <input
              class="api-key-input"
              type="text"
              :value="props.store.apiKey.value"
              @input="(event) => props.store.set('apiKey', event.target.value)"
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
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import throttle from 'lodash.throttle'
import 'tippy.js/dist/tippy.css'
import ActionMap from '@/components/ActionMap'
import InteractionToolbar from '@/components/InteractionToolbar'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

const actionMapComponent = ref(null)
const isShown = ref(true)

const recordPauseIcon = computed(() =>
  props.store.recording.value ? 'fa-solid fa-pause' : 'fa-solid fa-circle'
)
const recordPauseTooltipText = computed(() =>
  props.store.recording.value ? 'Pause Recording' : 'Start Recording'
)

function onClick(event) {
  const raivWidget = document.querySelector('#raiv')
  const target = event.target
  const boundingRect = target.getBoundingClientRect()
  const boundingBox = [
    boundingRect.left,
    boundingRect.top,
    boundingRect.right,
    boundingRect.bottom,
  ]

  // TODO: Is there a better way to determine if an event has bubbled besides pointerId?
  if (!raivWidget.contains(target) && event.pointerId !== -1) {
    if (hoveredElement !== undefined) {
      hoveredElement.classList.remove('raiv-hovered')
    }

    requestAnimationFrame(() => {
      props.store.actionMap.value.add(target, boundingBox, event)
      actionMapComponent.value.render()
      props.store.save()
    })
  }
}

let hoveredElement
function onMousemove(event) {
  const raivWidget = document.querySelector('#raiv')
  const target = event.target

  if (raivWidget.contains(target)) {
    if (hoveredElement !== undefined) {
      hoveredElement.classList.remove('raiv-hovered')
    }

    hoveredElement = undefined
  } else if (hoveredElement !== target) {
    if (hoveredElement !== undefined) {
      hoveredElement.classList.remove('raiv-hovered')
    }
    target.classList.add('raiv-hovered')

    hoveredElement = target
  }
}
const throttledMousemove = throttle(onMousemove, 100)

function recordToggle() {
  if (!props.store.recording.value) {
    props.store.set('recording', true)

    document.addEventListener('click', onClick, true)
    document.addEventListener('mousemove', throttledMousemove, true)
  } else {
    stopRecording()
  }
}

function stopRecording() {
  document.removeEventListener('click', onClick, true)
  document.removeEventListener('mousemove', throttledMousemove, true)

  if (hoveredElement !== undefined) {
    hoveredElement.classList.remove('raiv-hovered')
  }

  props.store.set('recording', false)
}

function resetRecording() {
  stopRecording()
  props.store.reset()
}

function toggleControlPanel(value) {
  if (value !== undefined) {
    isShown.value = value
  } else {
    isShown.value = !isShown.value
  }
  return isShown.value
}

function capture() {
  const serverLocation = `${props.store.serverScheme.value}://${props.store.serverAddress.value}:${props.store.serverPort.value}`

  props.store.actionMap.value.capture(
    toggleControlPanel,
    serverLocation,
    props.store.apiKey.value,
    props.store.videoName.value
  )
}

onMounted(() => {
  if (props.store.recording.value) {
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

.control-container {
  background: white;
  border: 1px solid black;
  border-radius: 4px;
}

.controls {
  padding: 1em;
  overflow: visible;
}

.controls div:not(:first-child) {
  margin-top: 2em;
}

.controls .recording-controls div {
  margin-top: 0;
}

.controls .recording-controls span {
  margin-right: 1em;
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

.api-key-input {
  width: 20em !important;
}
</style>
