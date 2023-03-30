<template>
  <router-link :to="`/player/${props.videoId}/`">
    <h2>{{ props.name }}</h2>
    <img :src="`/video/${props.videoId}/preview/`" />

    <button @click="deleteVideo">Delete</button>
  </router-link>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

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

const emit = defineEmits(['delete'])

function deleteVideo() {
  event.preventDefault()

  const confirmed = confirm(`Are you sure you wish to delete "${props.name}"?`)
  if (!confirmed) {
    return
  }

  fetch(`/video/${props.videoId}/`, {
    method: 'DELETE',
  })

  emit('delete', props.videoId)
}
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
  position: relative;
}

h2 {
  margin-bottom: 0.5em;
  text-align: center;
}

button {
  background: red;
  border-radius: 4px;
  bottom: 0;
  color: white;
  cursor: pointer;
  padding: 0.5em;
  position: absolute;
  right: 0;
}
</style>
