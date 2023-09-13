<template>
  <div
    class="control-container"
    v-drag="'#controls-handle'"
    v-show="isModalShown"
  >
    <div id="controls-handle" class="handle">
      <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip" />
      <span>RAIV Recorder</span>

      <div class="spacer"></div>

      <font-awesome-icon
        class="settings-btn fa-fw fa-lg"
        icon="fa-solid fa-cog"
        @click="toggleSettings"
      />
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
            :hidden="totalFrameCount <= 1"
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
      <div class="recording-dialogs" v-show="totalFrameCount > 1">
        <ActionMap ref="actionMapComponent" :store="props.store" />
        <IndependentActions
          ref="independentActionsComponent"
          :store="props.store"
        />
      </div>
      <div class="capture-settings">
        <p>
          {{ props.store.actionMap.value.independentActions.length }}
          independent actions.
        </p>
        <p>
          {{ props.store.actionMap.value.root.frameCount }}
          normal actions.
        </p>
        <p>
          {{ totalFrameCount }}
          total frames will be captured.
        </p>

        <div v-if="settingsShown">
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

        <div class="api-key" v-if="settingsShown">
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

        <button
          v-if="isControlsShown"
          type="button"
          :disabled="props.store.recording.value"
          @click="capture"
        >
          Capture
        </button>
        <p v-else>Recording in {{ recordCountdown }}...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import throttle from 'lodash.throttle'
import 'tippy.js/dist/tippy.css'
import ActionMap from '@/components/ActionMap'
import IndependentActions from '@/components/IndependentActions'
import InteractionToolbar from '@/components/InteractionToolbar'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

const initCountdown = 3
const actionMapComponent = ref(null)
const independentActionsComponent = ref(null)
const isModalShown = ref(true)
const isControlsShown = ref(true)
const recordCountdown = ref(initCountdown)
const settingsShown = ref(false)

const totalFrameCount = computed(() => {
  return (
    props.store.actionMap.value.root.frameCount *
    (props.store.actionMap.value.independentActions.length + 1)
  )
})

const recordPauseIcon = computed(() =>
  props.store.recording.value ? 'fa-solid fa-pause' : 'fa-solid fa-circle'
)
const recordPauseTooltipText = computed(() =>
  props.store.recording.value ? 'Pause Recording' : 'Start Recording'
)

function toggleSettings() {
  settingsShown.value = !settingsShown.value
}

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
    isModalShown.value = value
  } else {
    isModalShown.value = !isModalShown.value
  }
  return isModalShown.value
}

async function prepareCapture() {
  isControlsShown.value = false
  await startCountdown()
  toggleControlPanel(false)
}

async function finishCapture() {
  isControlsShown.value = true
  recordCountdown.value = initCountdown
  toggleControlPanel(true)
}

async function startCountdown() {
  while (recordCountdown.value > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    recordCountdown.value--
  }
}

function capture() {
  const serverLocation = `${props.store.serverScheme.value}://${props.store.serverAddress.value}:${props.store.serverPort.value}`
  const controls = {
    onPrepare: prepareCapture,
    onFinish: finishCapture,
  }
  props.store.actionMap.value.capture(
    controls,
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

.controls-handle {
  display: flex;
}

.spacer {
  flex: 1 1;
}

.handle span {
  font-weight: 600;
  height: 16px; /* This is weird. */
  padding-left: 1em;
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

.controls .recording-dialogs div {
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
.recording-dialogs {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  gap: 0 1em;
}

.settings-btn {
  cursor: pointer;
}
</style>
