<template>
  <dialog class="node-options-dialog" v-drag="'#node-options-handle'">
    <div id="node-options-handle" class="handle">
      <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip" />

      <button class="close-btn" type="button" @click="close">
        <font-awesome-icon icon="fa-solid fa-xmark" class="fa-lg" />
      </button>
    </div>

    <div class="contents">
      <div>
        <label>
          Wait time (ms) before capture:

          <input
            :value="props.action.waitTime"
            min="500"
            type="number"
            @change="
              (event) => {
                props.action.set('waitTime', event.target.value)
                props.store.save()
              }
            "
          />
        </label>
      </div>

      <div>
        <label>
          Manual capture:

          <input
            :checked="props.action.manualCapture"
            type="checkbox"
            @input="toggleManualCapture"
          />
        </label>
      </div>

      <div>
        <label>
          Disables siblings:

          <input
            :checked="props.action.disableSiblings"
            type="checkbox"
            @input="toggleDisableSiblings"
          />
        </label>
      </div>

      <div v-if="isCanvas">
        <p>
          The targeted element is a canvas. If there are interactions inside the
          canvas you want to capture then this tool can repeat this Action
          throughout the canvas. Choose the number of rows and columns of
          repeated Actions to perform on this canvas.
        </p>

        <label>
          Rows
          <input
            :value="props.action.canvasRanges[0]"
            min="1"
            type="number"
            @change="
              (event) => {
                props.action.set('canvasRanges', [
                  event.target.value,
                  props.action.canvasRanges[1],
                ])
                props.store.save()
              }
            "
          />
        </label>
        <label>
          Columns
          <input
            :value="props.action.canvasRanges[1]"
            min="1"
            type="number"
            @change="
              (event) => {
                props.action.set('canvasRanges', [
                  props.action.canvasRanges[0],
                  event.target.value,
                ])
                props.store.save()
              }
            "
          />
        </label>
      </div>

      <div>
        <button class="delete-btn" type="button" @click="deleteAction">
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onMounted,
} from 'vue'

const emit = defineEmits(['render'])

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },

  action: {
    required: true,
    type: Object,
  },
})

const isCanvas = computed(
  () =>
    props.action.target &&
    props.action.target.tagName.toLowerCase() === 'canvas'
)

let dialog

function open() {
  dialog.show()
}

function close() {
  dialog.close()
}

function toggleDisableSiblings() {
  props.action.set('disableSiblings', !props.action.disableSiblings)
  props.store.save()
}

function toggleManualCapture() {
  props.action.set('manualCapture', !props.action.manualCapture)
  props.store.save()
}

function deleteAction() {
  props.action.delete()
  emit('render')

  props.store.save()
  close()
}

onMounted(() => {
  dialog = document.querySelector('.node-options-dialog')
})

defineExpose({ open })
</script>

<style scoped>
.node-options-dialog {
  right: 1em;
  top: 1em;
  width: 30em !important;
  z-index: 10002;
}

.contents {
  padding: 1em;
}

.contents div:not(:first-child) {
  margin-top: 1em;
}

.delete-btn {
  background: red;
  color: white;
}
</style>
