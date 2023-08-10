<template>
  <div>
    <dialog class="confirm-capture-dialog" v-drag="'#confirm-capture-handle'">
      <div id="confirm-capture-handle" class="handle">
        <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip" />
      </div>

      <button class="confirm-btn" type="button">Capture</button>
    </dialog>
  </div>
</template>

<style scoped>
.confirm-capture-dialog {
  height: fit-content;
  width: 10em;
  left: -10em;
  top: 1em;
  z-index: 10003;
}

.confirm-btn {
  margin: 1em;
}
</style>
