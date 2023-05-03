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
  name: {
    required: true,
    type: String,
  },
  videoId: {
    required: true,
    type: String,
  },
})

const emit = defineEmits(['delete'])

function deleteVideo() {
  event.preventDefault()

  const apiKey = prompt(
    `To delete "${props.name}", please enter the API key used to generate it.`
  )

  if (!apiKey) {
    return
  }

  fetch(`/video/${props.videoId}/`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    method: 'DELETE',
  }).then((response) => {
    if (response.status >= 200 && response.status <= 299) {
      emit('delete', props.videoId)
    } else {
      alert('Invalid API key.')
    }
  })
}
</script>

<style scoped>
a {
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin: 1em;
  height: 300px;
  width: 300px;
  padding: 1em;
  position: relative;
}

h2 {
  margin-bottom: 0.5em;
  text-align: center;
}

img {
  overflow: hidden;
}

button {
  background: red;
  border-radius: 4px;
  bottom: 0.5em;
  color: white;
  cursor: pointer;
  padding: 0.5em;
  position: absolute;
  right: 0.5em;
}
</style>
