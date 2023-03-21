<template>
  <div>
    <h1>Gallery</h1>

    <ul>
      <PreviewCard
        v-for="video in videos"
        :key="video.id"
        :video-id="video.id"
        :name="video.name"
      ></PreviewCard>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PreviewCard from '@/components/PreviewCard'

const videos = ref([])

onMounted(() => {
  fetch('/video/')
    .then((response) => response.json())
    .then((data) => {
      videos.value = data
    })
})
</script>

<style scoped>
ul {
  display: flex;
}
</style>
