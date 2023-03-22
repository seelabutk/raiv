<template>
  <dialog class="node-options-dialog">
    <button class="close-btn" type="button" @click="close">
      <font-awesome-icon icon="fa-solid fa-xmark" class="fa-2x" />
    </button>

    <label>
      Wait time (ms) before capture:

      <input
        :value="props.action.waitTime"
        min="500"
        type="number"
        @change="
          (event) => {
            props.action.set('waitTime', event.target.value)
          }
        "
      />
    </label>

    <button type="button" @click="deleteAction">Delete</button>
  </dialog>
</template>

<script setup>
import { defineEmits, defineExpose, defineProps, onMounted } from 'vue'

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

let dialog

function open(event) {
  dialog.style.left = `calc(${event.clientX}px + 1em)`
  dialog.style.top = `${event.clientY}px`

  dialog.show()
}

function close() {
  dialog.close()
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
  height: fit-content;
  margin: 0;
  padding-top: 4em;
  position: fixed;
  width: fit-content;
  z-index: 10002;
}

.close-btn {
  position: absolute;
  right: 0.5em;
  top: 0.5em;
}
</style>
