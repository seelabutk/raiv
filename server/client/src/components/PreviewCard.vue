<template>
  <router-link :to="`/player/${props.videoId}/`">
    <h2>{{ props.name }}</h2>

    <img :src="`/video/${props.videoId}/preview/`" />
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue'

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

<style scoped>
a {
  border: 1px solid black;
  border-radius: 4px;
  display: block;
  margin: 1em;
  max-height: 300px;
  max-width: 300px;
  padding: 1em;
}

h2 {
  margin-bottom: 0.5em;
  text-align: center;
}
</style>
