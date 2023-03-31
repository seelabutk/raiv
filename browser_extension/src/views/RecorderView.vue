<template>
  <div>
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

<style>
#raiv {
  pointer-events: none; /* See note on next rule. */
  position: absolute;
  right: 1em;
  top: 1em;
  z-index: 10000;

  opacity: 0;
  transition: opacity 0.45s ease-in-out;
}

/* This is a hack. Basically, Vue will mount inside of a div and that
 * div can't be made draggable with our current setup, so the root div
 * will block elements that render underneath the original location. */
#raiv > div * {
  pointer-events: auto;
}

#raiv button {
  cursor: pointer;
}

#raiv dialog {
  border: 1px solid black;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  position: absolute;
  height: fit-content;
  width: fit-content;
}

#raiv .handle {
  align-items: center;
  border-bottom: 1px solid black;
  box-sizing: border-box;
  display: flex;
  height: 3em;
  padding-left: 1em;
  width: 100%;
}

#raiv .handle .close-btn {
  align-items: center;
  display: flex;
  margin-right: 0.5em;
  margin-left: auto;
}

.raiv-hovered {
  border: 2px solid #0000ff;
}

.raiv-selected {
  border: 2px solid #00ff00 !important;
}
</style>
