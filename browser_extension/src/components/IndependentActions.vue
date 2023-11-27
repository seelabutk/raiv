<template>
  <div>
    <button
      type="button"
      :disabled="independentActions.length < 1"
      @click="open"
    >
      View Independent Actions
    </button>
    <dialog
      class="independent-action-dialog"
      v-drag="'#independent-action-handle'"
    >
      <div id="independent-action-handle" class="handle">
        <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip" />

        <button class="close-btn" type="button" @click="close">
          <font-awesome-icon icon="fa-solid fa-xmark" class="fa-lg" />
        </button>
      </div>

      <NodeOptions
        ref="independentNodeOptions"
        :store="props.store"
        :action="currentAction"
        :title="nodeTitle"
        optionsClass="indpedendent-node-options-dialog"
        @render="render"
      />

      <div class="independent-action-contents">
        <table class="styled-table">
          <thead>
            <tr>
              <th class="table-header-title">Label</th>
              <th class="table-header-title">Type</th>
              <th class="table-header-title">Options</th>
              <!-- <th class="table-header-title">Wait Time</th>
              <th class="table-header-title">Manual Capture</th>
              <th class="table-header-title">Disable Siblings</th>
              <th class="table-header-title">Canvas Rows</th>
              <th class="table-header-title">Canvas Columns</th> -->
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(action, i) in independentActions" :key="i">
              <td>
                <tippy v-bind:content="label(action)">
                  {{ crop(label(action), 10) }}
                </tippy>
              </td>
              <td>{{ action.type }}</td>
              <td>
                <tippy content="Action Options">
                  <button
                    class="action-options-btn"
                    type="button"
                    @click="modifyActions(action)"
                  >
                    <font-awesome-icon icon="fa-solid fa-trash" class="fa-sm" />
                  </button>
                </tippy>
              </td>
              <!-- <td>
                <input
                  class="number-input"
                  :value="independentActions[i].waitTime"
                  min="0"
                  step="100"
                  type="number"
                  @change="
                    (event) => {
                      handleWaitTimeChange(event, action)
                    }
                  "
                />
              </td>
              <td>
                <input
                  class="toggle-input"
                  :checked="action.manualCapture"
                  type="checkbox"
                  @input="toggleManualCapture(action)"
                />
              </td>
              <td>
                <input
                  class="toggle-input"
                  :checked="action.disableSiblings"
                  type="checkbox"
                  @input="toggleDisableSiblings(action)"
                />
              </td>
              <td>
                <input
                  v-if="isCanvas(action)"
                  :value="action.canvasRanges[0]"
                  min="1"
                  type="number"
                  @change="
                    (event) => {
                      action.set('canvasRanges', [
                        event.target.value,
                        action.canvasRanges[1],
                      ])
                      props.store.save()
                    }
                  "
                />
              </td>
              <td>
                <input
                  v-if="isCanvas(action)"
                  :value="action.canvasRanges[1]"
                  min="1"
                  type="number"
                  @change="
                    (event) => {
                      action.set('canvasRanges', [
                        action.canvasRanges[0],
                        event.target.value,
                      ])
                      props.store.save()
                    }
                  "
                />
              </td> -->
              <td>
                <tippy content="Delete Action">
                  <button
                    class="delete-action-btn"
                    type="button"
                    @click="deleteAction(action)"
                  >
                    <font-awesome-icon icon="fa-solid fa-trash" class="fa-sm" />
                  </button>
                </tippy>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </dialog>
  </div>
</template>
<script setup>
import { defineProps, defineExpose, onMounted, computed, ref } from 'vue'
import 'tippy.js/dist/tippy.css'
import NodeOptions from '@/components/NodeOptions'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

let currentAction = ref(props.store.actionMap.value.root)
const independentNodeOptions = ref(null)
const nodeTitle = ref('')

let dialog

const independentActions = computed(() => {
  return props.store.actionMap &&
    props.store.actionMap.value &&
    props.store.actionMap.value.independentActions &&
    props.store.actionMap.value.independentActions.length > 0
    ? props.store.actionMap.value.independentActions
    : []
})

function label(action) {
  const target = action.target
  let tagName = target.tagName.toLowerCase()
  // Add the element's ID for easy identification
  if (target.id !== '') {
    tagName += `#${target.id}`
  }

  // Add the element's classList for additional context
  const classes = [...target.classList].filter(
    (className) => !className.startsWith('raiv')
  )
  if (classes.length > 0) {
    tagName += `.${classes.join('.')}`
  }

  return tagName
}

function crop(label, length = 50) {
  if (label.length > length) {
    label = label.slice(0, length - 3) + '...'
  }
  return label
}
/*
function isCanvas(action) {
  return action.target && action.target.tagName.toLowerCase() === 'canvas'
}
*/

function modifyActions(action) {
  currentAction.value = action
  nodeTitle.value = label(action)
  independentNodeOptions.value.open()
}

function deleteAction(action) {
  props.store.actionMap.value.deleteIndependentAction(action)
  props.store.save()
}

function render() {
  // no-op
}
/*
function toggleDisableSiblings(action) {
  action.set('disableSiblings', !action.disableSiblings)
  props.store.save()
}

function toggleManualCapture(action) {
  action.set('manualCapture', !action.manualCapture)
  props.store.save()
}

function handleWaitTimeChange(e, action) {
  action.set('waitTime', event.target.value)
  props.store.save()
}
*/

function open() {
  dialog.show()
}

function close() {
  dialog.close()
}

onMounted(() => {
  dialog = document.querySelector('.independent-action-dialog')
  render()
})

defineExpose({ render })
</script>

<style scoped>
.independent-action-dialog {
  left: -10em;
  top: 1em;
  z-index: 10001;
  width: 600px !important;
  max-height: 600px;
}

.styled-table {
  border-collapse: collapse;
  font-size: 0.9em;
  font-family: sans-serif;
  border: 1px solid #000;
  overflow-y: auto;
  max-height: 500px;
  max-width: fit-content;
  width: 100%;
  display: block;
}

.styled-table thead tr {
  background-color: #333;
  color: #ffffff !important;
  text-align: left;
  height: 50px !important;
  max-height: 50px !important;
}

.table-header-title {
  color: #ffffff !important;
}

.styled-table thead {
  position: sticky !important;
  top: 0;
}

.styled-table th {
  height: 75px !important;
}
.styled-table th,
.styled-table td {
  padding: 6px 9px;
  height: 50px !important;
}

td {
  width: 50px !important;
  height: 50px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: no-wrap !important;
}
.delete-action-btn {
  background-color: #ff0000 !important;
  color: white !important;
  height: 20px !important;
  width: 20px !important;
  padding: 0px !important;
}
.styled-table tbody tr {
  height: 50px !important;
  max-height: 50px !important;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #d3d3d3;
}
.independent-action-contents {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  padding: 1em;
  width: 100%;
}

input[type='checkbox'] {
  width: 1em !important;
  height: 1em !important;
}

/* Hide number input arrows */

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  width: 60px !important;
  -moz-appearance: textfield;
}
</style>
