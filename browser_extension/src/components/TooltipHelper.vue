<template>
  <div class="tooltip-wrapper">
    <slot />
    <span :class="tooltipClasses">{{ text }}</span>
  </div>
</template>
<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'bottom',
  },
})

const tooltipClasses = computed(() => ({
  tooltip__text: true,
  [`tooltip--${props.position}`]: true,
}))
</script>

<style scoped>
:slotted(*) {
}
:slotted(*):focus + .tooltip__text {
  visibility: visible;
  opacity: 1;
}
:slotted(*):not(focus) + .tooltip__text {
  visibility: hidden;
  opacity: 0;
}

.tooltip__text {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s;

  color: #ffffff;
  text-align: center;
  padding: 5px 0;
  border-radius: 2px;
  min-width: 120px;
  background: #f2f4f6;
  position: absolute;
  border: 1px solid #000000;
}

.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip-wrapper:hover .tooltip__text {
  visibility: visible;
  opacity: 1;
}
.tooltip-wrapper:not(:hover) .tooltip__text {
  visibility: hidden;
  opacity: 0;
}
.tooltip__text::after {
  content: ' ';
  position: absolute;
  border-width: 5px;
  border-style: solid;
}
.tooltip--left {
  inset-block-end: 0%;
  inset-inline-end: 110%;
}
.tooltip--right {
  inset-block-end: 0%;
  inset-inline-start: 110%;
}

.tooltip--top {
  inset-block-end: 120%;
  inset-inline-start: 50%;
  margin-inline-start: -60px;
}
.tooltip--bottom {
  inset-block-start: 120%;
  inset-inline-start: 50%;
  margin-inline-start: -60px;
}

.tooltip--left::after {
  inset-block-start: 50%;
  inset-inline-start: 100%;
  border-color: transparent transparent transparent #000000;
}

.tooltip--right::after {
  inset-block-start: 50%;
  inset-inline-end: 100%;
  border-color: transparent #000000 transparent transparent;
}

.tooltip--top::after {
  inset-block-start: 100%;
  inset-inline-start: 50%;
  border-color: #000000 transparent transparent transparent;
}

.tooltip--bottom::after {
  inset-block-end: 100%;
  inset-inline-start: 50%;
  border-color: transparent transparent #000000 transparent;
}
</style>
