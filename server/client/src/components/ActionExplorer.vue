<template>
  <section class="actionExplorerOverlay">
    <!-- open/close -->
    <div class="toggleExplorer">
      <div class="toggleIcon">
        <font-awesome-icon
          v-if="!explorerIsShown"
          class="fa-fw fa-lg"
          icon="fa-solid fa-bars"
        />
        <font-awesome-icon v-else class="fa-fw fa-lg" icon="fa-solid fa-x" />
      </div>
    </div>
    <!-- nodes -->
    <ActionMap
      v-if="explorerIsShown && props.actionMap !== undefined"
      ref="explorer"
      :actionMap="props.actionMap"
      :currentAction="props.currentAction"
      :setCurrentAction="props.setCurrentAction"
      :showPath="props.showPath"
    />
  </section>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import ActionMap from './ActionMap.vue'
const props = defineProps({
  actionMap: {
    required: true,
    type: Object,
  },
  currentAction: {
    required: true,
    type: Object,
  },
  setCurrentAction: {
    required: true,
    type: Function,
  },
  showPath: {
    required: false,
    type: Boolean,
    default: false,
  },
})

const explorer = ref(null)
const explorerIsShown = ref(false)
// const render = computed(() => explorer.value?.render !== undefined)
const toggleExplorer = () => {
  explorerIsShown.value = !explorerIsShown.value
  const overlay = document.querySelector('.actionExplorerOverlay')

  if (explorerIsShown.value) {
    overlay.style.backgroundPosition = 'right'
  } else {
    overlay.style.backgroundPosition = 'left'
  }
}

onMounted(() => {
  document
    .querySelector('.toggleExplorer')
    .addEventListener('click', toggleExplorer)
})
</script>
<style scoped>
.actionExplorerOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent 50%, rgba(0, 0, 0, 0.6) 50%)
    left;
  z-index: 100;
  background-size: 200%;
  transition: 0.5s ease-out;
}

.toggleExplorer {
  background: white;
  position: absolute;
  top: 1px;
  right: 1px;
  width: 40px;
  height: 40px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border-radius: 25px;
  z-index: 10001;
  cursor: pointer;
}
.toggleIcon {
  margin: auto;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
}
</style>
