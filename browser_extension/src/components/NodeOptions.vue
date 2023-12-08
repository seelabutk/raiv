<template>
  <dialog
    :class="props.optionsClass"
    id="node-options-dialog"
    v-drag="`#${props.optionsClass}-handle`"
  >
    <div :id="`${props.optionsClass}-handle`" class="handle">
      <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip" />

      <button class="close-btn" type="button" @click="close">
        <font-awesome-icon icon="fa-solid fa-xmark" class="fa-lg" />
      </button>
    </div>

    <div class="contents">
      <h3>{{ props.title }}</h3>
      <table class="form-table">
        <tr>
          <td class="form-label">
            <label for="wait-time">Wait time (s) before capture</label>
          </td>
          <td class="form-divider"></td>

          <td class="form-input">
            <input
              :value="props.action.waitTime / 1000"
              min="0"
              type="number"
              id="wait-time"
              @change="
                (event) => {
                  props.action.set('waitTime', event.target.value * 1000)
                  props.store.save()
                }
              "
            />
          </td>
        </tr>
        <tr>
          <td class="form-label">
            <label for="manual-capture">Manual capture</label>
          </td>
          <td class="form-divider"></td>

          <td class="form-input">
            <input
              id="manual-capture"
              :checked="props.action.manualCapture"
              type="checkbox"
              @input="toggleManualCapture"
            />
          </td>
        </tr>
        <tr>
          <td class="form-label">
            <label for="disables-siblings">Disables siblings</label>
          </td>
          <td class="form-divider"></td>

          <td class="form-input">
            <input
              id="disables-siblings"
              :checked="props.action.disableSiblings"
              type="checkbox"
              @input="toggleDisableSiblings"
            />
          </td>
        </tr>
      </table>

      <div style="width: 100%" v-if="isSlider">
        <p>
          The targeted element is a slider. Choose the orientation of the
          slider, and the number of discrete steps to record.
        </p>
        <table class="form-table">
          <tr>
            <td class="form-label">
              <label for="slider-orientation">Orientation</label>
            </td>
            <td class="form-divider"></td>
            <td class="form-input">
              <select
                id="slider-orientation"
                :value="props.action.sliderOrientation"
                @change="
                  (event) => {
                    props.action.set('sliderOrientation', event.target.value)
                    props.store.save()
                  }
                "
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="form-label">
              <label for="slider-steps">Steps</label>
            </td>
            <td class="form-divider"></td>
            <td class="form-input">
              <input
                class="slider-steps"
                :value="props.action.sliderSteps"
                min="1"
                type="number"
                @change="
                  (event) => {
                    console.log('here?')
                    props.action.set('sliderSteps', event.target.value)
                    props.store.save()
                  }
                "
              />
            </td>
          </tr>
        </table>

        <!-- <label>
          Orientation
          <select
            :value="props.action.sliderOrientation"
            @change="
              (event) => {
                props.action.set('sliderOrientation', event.target.value)
                props.store.save()
              }
            "
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label> -->

        <!-- <label>
          Steps
          <input
            :value="props.action.sliderSteps"
            min="1"
            type="number"
            @change="
              (event) => {
                props.action.set('sliderSteps', event.target.value)
                props.store.save()
              }
            "
          />
        </label> -->
      </div>

      <div style="width: 100%" v-if="isCanvas">
        <p>
          The targeted element is a canvas. If there are interactions inside the
          canvas you want to capture then this tool can repeat this Action
          throughout the canvas. Choose the number of rows and columns of
          repeated Actions to perform on this canvas.
        </p>
        <table class="form-table">
          <tr>
            <td class="form-label">
              <label for="canvas-rows">rows</label>
            </td>
            <td class="form-divider"></td>
            <td class="form-input">
              <input
                id="canvas-rows"
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
            </td>
          </tr>
          <tr>
            <td class="form-label">
              <label for="canvas-cols">cols</label>
            </td>
            <td class="form-divider"></td>

            <td class="form-input">
              <input
                id="canvas-cols"
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
            </td>
          </tr>
        </table>
      </div>

      <div class="node-options-actions">
        <button class="delete-btn" type="button" @click="deleteAction">
          Delete
        </button>
        <button class="change-parent" type="button" @click="changeParent">
          {{ isChangeParentText }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import {
  ref,
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

  title: {
    required: true,
    type: String,
  },

  optionsClass: {
    required: true,
    type: String,
  },
})

const isCanvas = computed(
  () =>
    props.action.target &&
    props.action.target.tagName.toLowerCase() === 'canvas'
)
const isSlider = computed(() => props.action.type === 'slider')

const isChangeParent = ref(false)
const isChangeParentText = computed(() =>
  isChangeParent.value ? 'Cancel Change' : 'Change Parent'
)
const changeParent = () => {
  isChangeParent.value = !isChangeParent.value
}

let dialog

function open() {
  isChangeParent.value = false
  dialog.show()
}

function close() {
  isChangeParent.value = false
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
  dialog = document.querySelector(`.${props.optionsClass}`)
})

defineExpose({ open, isChangeParent })
</script>

<style scoped>
#node-options-dialog {
  right: 1em;
  top: 1em;
  width: 30em !important;
  z-index: 10002;
}
.node-options-actions {
  display: flex;
  justify-content: space-between;
}

input {
  max-width: 10em !important;
}


.contents {
  padding: 1em;
}

.form-table {
  width: 100%;
  margin-top: 1em;
  table-layout: fixed;
}
.form-label {
  text-align: right;
  width: 49%;
}
.form-divider {
  width: 2%;
}
.form-input {
  text-align: left;
  width: 49%;
}

.contents div:not(:first-child) {
  margin-top: 1em;
}

button .delete-btn {
  background: red;
  color: white;
}
</style>
