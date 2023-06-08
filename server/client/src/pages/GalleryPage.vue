<template>
  <nav>
    <h1 class="nav--title">RAIV Gallery</h1>
    <div class="nav--searchbar">
      <font-awesome-icon
        class="fa-fw fa-sm"
        icon="fa-solid fa-magnifying-glass"
      />

      <input
        v-model="searchQuery"
        class="nav--searchbar-input"
        type="text"
        placeholder="Search"
      />
    </div>
  </nav>
  <div class="gallery">
    <ul>
      <PreviewCard
        v-for="video in filterVideos()"
        :key="video.id"
        :name="video.name"
        :video-id="video.id"
        :metadata="video.metadata"
        @delete="deleteCard(video)"
      ></PreviewCard>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PreviewCard from '@/components/PreviewCard'

const videos = ref([])
const searchQuery = ref('')

function deleteCard(video) {
  const index = videos.value.indexOf(video)

  if (index >= 0) {
    videos.value.splice(index, 1)
  }
}

function filterVideos() {
  return videos.value.filter((video) =>
    video.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

onMounted(() => {
  fetch('/video/')
    .then((response) => response.json())
    .then((data) => {
      data.sort(function (a, b) {
        return a.metadata.created < b.metadata.created
          ? 1
          : a.metadata.created > b.metadata.created
          ? -1
          : 0
      })
      videos.value = data
    })
})
</script>

<style scoped>
h1 {
  font-size: 1.25em;
  margin-bottom: 2em;
}
nav {
  display: flex;
  flex-direction: row;
  height: 70px;
  padding: 20px 20px;
  background-color: #eee;
}

.nav--title {
  font-weight: bold;
}
.nav--searchbar {
  margin-left: auto;
  margin-right: 1em;
  outline: solid 1px;
  border-radius: 4px;
}

.nav--searchbar-input {
  padding: 0;
  /* margin-left: auto; */
  /* margin-right: 1em; */
  /* outline: solid 1px; */
  /* border-radius: 4px; */
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
