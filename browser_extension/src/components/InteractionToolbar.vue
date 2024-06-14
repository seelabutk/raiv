<template>
  <div id="interaction-toolbar" style="display: block !important;">
    <label>
      Interaction type:

      <select 
        :value="actionMap.interactionType"
        @change="
          (event) => actionMap.set('interactionType', event.target.value)
        "
        style="appearance: auto !important;"
      >
        <option value="click">Click</option>
        <option value="hover">Hover</option>
        <option value="toggle">Toggle</option>
        <option value="slider">Slider</option>
      </select>
    </label>
    <br />
    <label>
      Independent Action:
      <input type="checkbox" v-model="actionMap.independentAction" style="appearance: auto;"/>
    </label>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

const actionMap = computed(() => {
  return props.store.actionMap.value
})
</script>


<style scoped>
label {
  position: static;
  text-indent: 0px;
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
}
</style>