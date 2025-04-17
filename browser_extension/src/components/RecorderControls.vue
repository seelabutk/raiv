<template>
  <div>
    <div style="position:fixed; margin 0; z-index: 10002">
      <!-- Child Dialogues -->
      <ActionMap ref="actionMapComponent" :store="props.store" />
      <IndependentActions
        ref="independentActionsComponent"
        :store="props.store"
      />
    </div>
    <div
      class="control-container"
      v-drag="'#controls-handle'"
      v-show="isModalShown"
    >
      <div id="controls-handle" class="handle">
        <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip"/>
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
          <tippy
            :content="recordPauseTooltipText"
            content-class="tippy-tooltip"
          >
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
          <button
            type="button"
            :disabled="props.store.actionMap.value.root.frameCount < 2"
            @click="openActionMap"
          >
            View Action Map
          </button>

          <button
            type="button"
            :disabled="independentActions.length < 1"
            @click="openIndependentActions"
          >
            View Independent Actions
          </button>
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
                @input="
                  (event) => props.store.set('apiKey', event.target.value)
                "
              />
            </label>
          </div>

          <div class="user-name" v-if="settingsShown">
            <label>
              User Name
              <input
                class="name-input"
                type="text"
                :value="props.store.username.value"
                @input="
                  (event) => props.store.set('username', event.target.value)
                "
              />
            </label>
          </div>

          <div class="group-name" v-if="settingsShown">
            <label>
              Group Name
              <input
                class="name-input"
                type="text"
                :value="props.store.groupName.value"
                @input="
                  (event) => props.store.set('groupName', event.target.value)
                "
              />
            </label>
          </div>

          <div class="visibility-toggle" v-if="settingsShown">
            <label>
              Visibility
              <div class="toggle-container">
                <button 
                  :class="['toggle-btn', props.store.isPublic.value ? 'active' : 'inactive']" 
                  @click="toggleVisibility(true)"
                >
                  Public
                </button>
                <button 
                  :class="['toggle-btn', !props.store.isPublic.value ? 'active' : 'inactive']" 
                  @click="toggleVisibility(false)"
                >
                  Private
                </button>
              </div>
            </label>
          </div>

         

          <!-- <div class="upload-action-map" v-if="settingsShown">
            <input type="file" ref="fileInput" @change="handleFileUpload">
            <button @click="confirmFileUpload">Upload Action Map</button>
          </div> -->
          
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

const independentActions = computed(() => {
  return props.store.actionMap &&
    props.store.actionMap.value &&
    props.store.actionMap.value.independentActions &&
    props.store.actionMap.value.independentActions.length > 0
    ? props.store.actionMap.value.independentActions
    : []
})

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

function toggleVisibility(value) {
  props.store.set('isPublic', value)
  console.log(`Visibility set to: ${props.store.isPublic.value ? 'Public' : 'Private'}`)
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
    //document.addEventListener('keydown', detectKeyDown, true)
  } else {
    stopRecording()
  }
}

function stopRecording() {
  document.removeEventListener('click', onClick, true)
  document.removeEventListener('mousemove', throttledMousemove, true)
  //document.removeEventListener('keydown', detectKeyDown, true)

  if (hoveredElement !== undefined) {
    hoveredElement.classList.remove('raiv-hovered')
  }

  props.store.set('recording', false)
}

/*function detectKeyDown(){
  let cKeyPressed = false
  let rKeyPressed = false
  let spacebarPressed = false
  let keyTimeout = null

  const keyDownHandler = (event) => {
    if(event.key === 'c'){
      cKeyPressed = true
    }    
    if(event.key === 'r'){
      rKeyPressed = true
    }    
    if(event.key === ' ' || event.keyCode === 32){
      event.preventDefault()  
      spacebarPressed = true
    }

    if(((cKeyPressed && !rKeyPressed) || (!cKeyPressed && rKeyPressed)) && spacebarPressed){
      if(rKeyPressed){
        stopRecording()
      }
      else if(cKeyPressed){
        capture()
      }
    }
    else{
      clearTimeout(keyTimeout)
      keyTimeout = setTimeout(resetKeyStates, 500)
    }
  }
  const resetKeyStates = () => {
    cKeyPressed = false
    rKeyPressed = false
    spacebarPressed = false
  }
  return keyDownHandler
}*/

function resetRecording() {
  stopRecording()
  props.store.reset()
}

/*let jsonActionMap
function handleFileUpload(){
  const file = event.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = (e) => {
      jsonActionMap = JSON.parse(e.target.result);
      console.log('Action map:', jsonActionMap);
    };
    reader.readAsText(file);
  }
}

function confirmFileUpload(){
  console.log('Upload button clicked');
  //Remember to do some security checking 
  props.store.actionMap.value.uploadActionMap(jsonActionMap)
  actionMapComponent.value.render()
  console.log("finished render")
  props.store.save()

}*/

function openActionMap() {
  if(actionMapComponent.value.checkIsOpen()){
    actionMapComponent.value.close()
  }
  else{
    actionMapComponent.value.open()
  }
}

function openIndependentActions() {
  if(independentActionsComponent.value.checkIsOpen()){
    independentActionsComponent.value.close()
  }
  else{
    independentActionsComponent.value.open()
  }
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
    props.store.videoName.value,
    props.store.username.value,
    props.store.groupName.value,
    props.store.isPublic.value
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
  color: black;
}

input {
  text-align: left;
  color: black;
}

.control-container {
  background: white;
  border: 1px solid black;
  border-radius: 4px;
  color: black;
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
  position: static;
}

.capture-settings p {
  color: black;
}

.api-key-input {
  width: 20em !important;
}

.name-input {
  width: 10em;
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

/* New styles for the visibility toggle */
.toggle-container {
  display: inline-flex;
  margin-left: 0.5em;
}

.toggle-btn {
  font-size: 0.9em;
  margin: 0;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  color: black;
}

.toggle-btn.active {
  background-color: #007bff;
  border-color: #0056b3;
}

.toggle-btn.inactive {
  background-color: #e0e0e0;
  color: #666;
  border-color: #ccc;
}

.visibility-toggle {
  display: flex;
  align-items: center;
}
</style>