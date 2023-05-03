<template>
  <div class="gallery">
    <h1>Gallery</h1>

    <ul>
      <PreviewCard
        v-for="video in videos"
        :key="video.id"
        :name="video.name"
        :video-id="video.id"
        @delete="deleteCard(video)"
      ></PreviewCard>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PreviewCard from '@/components/PreviewCard'

const videos = ref([])

function deleteCard(video) {
  const index = videos.value.indexOf(video)

  if (index >= 0) {
    videos.value.splice(index, 1)
  }
}

onMounted(() => {
  fetch('/video/')
    .then((response) => response.json())
    .then((data) => {
      videos.value = data
    })
})
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
