<template>
  <div id="raiv-container">
    <RecorderControls :store="store" />
    <ConfirmCapture />
  </div>
</template>

<script setup>
import ConfirmCapture from '@/components/ConfirmCapture'
import RecorderControls from '@/components/RecorderControls'
import Store from '@/store/store'

const store = new Store()
</script>

<style lang="scss" scoped>
@import '@/assets/reset.scss';

#raiv-container {
  pointer-events: none; /* See note on next rule. */
  position: absolute;
  right: 1em;
  top: 1em;
  z-index: 10000;

  opacity: 100;
  transition: opacity 0.45s ease-in-out;
}

#raiv-container:deep(*) {
}

/* This is a hack. Basically, Vue will mount inside of a div and that
 * div can't be made draggable with our current setup, so the root div
 * will block elements that render underneath the original location. */
#raiv-container:deep(div *) {
  pointer-events: auto;
}

#raiv-container:deep(button) {
  cursor: pointer;
  padding: 0.5em;
  height: fit-content;
  width: fit-content;
  background: #d3d3d3;
}

#raiv-container:deep(button:not(:disabled)) {
  border: 1px solid black;
}

#raiv-container:deep(dialog) {
  border: 1px solid black;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  position: absolute;
  height: fit-content;
  width: fit-content;
}

#raiv-container:deep(input),
#raiv-container:deep(select) {
  width: unset;
  border: 1px solid black;
  background: white;
}

#raiv-container:deep(.handle) {
  align-items: center;
  border-bottom: 1px solid black;
  box-sizing: border-box;
  display: flex;
  height: 3em;
  padding: 0 1em;
  width: 100%;
}

#raiv-container:deep(.handle .close-btn) {
  align-items: center;
  display: flex;
  margin-left: auto;
  cursor: pointer;
}
</style>

<style>
.raiv-hovered {
  border: 2px solid #0000ff;
}
</style>
