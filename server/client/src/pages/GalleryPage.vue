<template>
  <div>
    <h1>Gallery</h1>

    <ul>
      <PreviewCard
        v-for="video in videos"
        :key="video.id"
        :video-id="video.id"
        :name="video.name"
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
  padding: 2em;
}

ul {
  display: flex;
  flex-wrap: wrap;
}
</style>
