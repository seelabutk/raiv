<template>
  <div>
    <h1>RAIV!</h1>
    <p>Hello. Intro text here.</p>
    <RecordingControls :worker="props.worker" />
    <ActionMap :worker="props.worker" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

import ActionMap from '@/components/ActionMap'
import RecordingControls from '@/components/RecordingControls'

const props = defineProps({
  worker: {
    required: true,
    type: Object,
  },
})
</script>
