<template>
  <dialog class="node-options-dialog">
    <button class="close-btn" type="button" @click="close">
      <font-awesome-icon icon="fa-solid fa-xmark" class="fa-2x" />
    </button>

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
  const frameCount = props.store.actionMap.value.frameCount
  const deletedFrames = props.action.frameCount

  props.action.delete()
  props.store.actionMap.value.set('frameCount', frameCount - deletedFrames)

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
