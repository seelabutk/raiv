<template>
  <div class="gallery">
    <h1>Gallery</h1>

    <div>
      <label>
        Enter your API key to view your videos:
        <input v-model="apiKey" />
      </label>

      <button @click="fetchVideos">Fetch Videos</button>

      <span v-if="hasError" class="error">
        {{ error }}
      </span>
    </div>

    <ul>
      <PreviewCard
        v-for="video in videos"
        :key="video.id"
        :api-key="apiKey"
        :name="video.name"
        :video-id="video.id"
        @delete="deleteCard(video)"
      ></PreviewCard>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import PreviewCard from '@/components/PreviewCard'

const apiKey = ref('')
const error = ref()
const videos = ref([])

const hasError = computed(() => error.value !== undefined)

function deleteCard(video) {
  const index = videos.value.indexOf(video)

  if (index >= 0) {
    videos.value.splice(index, 1)
  }
}

function fetchVideos() {
  fetch('/video/', {
    headers: { Authorization: `Bearer ${apiKey.value}` },
  }).then((response) => {
    response.json().then((data) => {
      if (response.status >= 200 && response.status <= 299) {
        error.value = undefined
        videos.value = data
      } else {
        error.value = data.detail
        videos.value = []
      }
    })
  })
}
</script>

<style scoped>
h1 {
  font-size: 1.25em;
  margin-bottom: 2em;
}

input {
  margin-right: 1em;
  outline: solid 1px;
}

button {
  background: #eee;
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 0.5em;
}

ul {
  display: flex;
  flex-wrap: wrap;
}

.error {
  color: red;
  font-style: italic;
  margin-left: 0.25em;
}

.gallery {
  padding: 2em;
}
</style>
