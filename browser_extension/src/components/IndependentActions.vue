<template>
  <div>
    <div style="position:fixed; margin 0; z-index: 10002">
      <!-- Child Dialogues -->
      <NodeOptions
        ref="independentNodeOptions"
        :store="props.store"
        :action="currentAction"
        :title="nodeTitle"
        optionsClass="indpedendent-node-options-dialog"
        @render="render"
      />
    </div>
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

      <div class="independent-action-contents">
        <table class="styled-table">
          <thead></thead>
          <tbody>
            <tr v-for="(action, i) in independentActions" :key="i">
              <td style="min-width: 1.5em; padding-right: 0">
                <img :src="getIconHref(action)" class="action-type-icon" />
              </td>
              <td style="width: 100%; padding-left: 0.75em">
                <tippy v-bind:content="label(action)">
                  <div style="display: flex; flex-direction: row">
                    {{ crop(label(action), 30) }}
                  </div>
                </tippy>
              </td>
              <td style="width: 1.5em">
                <tippy content="Edit Action">
                  <font-awesome-icon
                    id="edit-action-icon"
                    class="fa-md"
                    icon="fa-solid fa-pen"
                    @click="modifyActions(action)"
                  />
                </tippy>
              </td>
              <td style="width: 1.5em">
                <tippy content="Delete Action">
                  <font-awesome-icon
                    id="delete-action-icon"
                    class="fa-md"
                    icon="fa-solid fa-trash"
                    @click="deleteAction(action)"
                  />
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
/* global chrome */
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

function getIconHref(action) {
  const type = action.type
  let href = ''
  if (type === 'click') {
    href = chrome.runtime.getURL('/icons/hand-pointer-solid.svg')
  } else if (type === 'hover') {
    href = chrome.runtime.getURL('/icons/arrow-pointer-solid.svg')
  } else if (type === 'toggle') {
    href = chrome.runtime.getURL('/icons/toggle-on-solid.svg')
  } else if (type === 'toggle-off') {
    href = chrome.runtime.getURL('/icons/toggle-off-solid.svg')
  } else if (type === 'slider') {
    href = chrome.runtime.getURL('/icons/sliders-solid.svg')
  }
  return href
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

defineExpose({ open, close, render })
</script>

<style scoped>
.independent-action-dialog {
  left: -10em;
  top: 1em;
  z-index: 10001;
  width: 300px !important;
  max-height: 600px;
}
.action-type-icon {
  min-height: 1em !important;
  max-height: 1em !important;
  padding-right: 0;
}

.styled-table {
  border-collapse: collapse;
  font-size: 0.9em;
  border: 1px solid #000;
  overflow-y: auto;
  max-height: 500px;
  width: 100%;
  display: block;
}

.styled-table thead {
  position: sticky !important;
  top: 0;
}

.styled-table thead tr {
  background-color: #333;
  color: #ffffff !important;
  text-align: left;
  height: 50px !important;
  max-height: 50px !important;
  width: 100%;
}

.styled-table td {
  padding: 6px 9px;
  height: 50px !important;
}

td {
  height: 50px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: no-wrap !important;
}

.styled-table tbody tr {
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
  max-height: 300px;
}

#edit-action-icon {
  color: #ffc107 !important;
}

#delete-action-icon {
  color: #e34724 !important;
}

/* Hide number input arrows */

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
/*
input[type='number'] {
    width: 60px !important;
    -moz-appearance: textfield;
}
  */
</style>
