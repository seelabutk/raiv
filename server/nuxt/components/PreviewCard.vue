<template>
  <div>
    <h2>{{ props.name }}</h2>

    <img :src="`/preview/${props.videoId}/`" />
  </div>
</template>

<script setup>
const props = defineProps({
  videoId: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
})
</script>
