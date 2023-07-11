<template>
  <nav>
    <h1 class="nav--title">RAIV Gallery</h1>

    <!-- Search Bar -->
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

    <!-- Order By Field -->
    <tippy
      content="Select the field objects are ordered by."
      content-class="tippy-tooltip"
    >
      <div class="nav--sortby">
        <select name="sort" v-model="sortType" class="nav--sortby-select">
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="size">File Size</option>
          <option value="title">Title</option>
        </select>
        <font-awesome-icon class="fa-fw fa-sm" icon="fa-solid fa-caret-down" />
      </div>
    </tippy>

    <!-- Order Direction -->
    <div class="nav--sort-dir" @click="sortReversed = !sortReversed">
      <tippy
        v-if="sortReversed"
        content="Order Ascending"
        content-class="tippy-tooltip"
      >
        <font-awesome-icon class="fa-fw fa-sm" icon="fa-solid fa-arrow-up" />
      </tippy>
      <tippy
        v-if="!sortReversed"
        content="Order Descending"
        content-class="tippy-tooltip"
      >
        <font-awesome-icon class="fa-fw fa-sm" icon="fa-solid fa-arrow-down" />
      </tippy>
    </div>
  </nav>

  <!--Video Preview Gallery  -->
  <div class="gallery">
    <ul>
      <PreviewCard
        v-for="video in getVideoList(sortType, sortReversed)"
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
import 'tippy.js/dist/tippy.css'
import { getSortFunction } from '@/utils/Sorts'

const sortType = ref('created')
const sortReversed = ref(false)
const videos = ref([])
const searchQuery = ref('')

function deleteCard(video) {
  const index = videos.value.indexOf(video)

  if (index >= 0) {
    videos.value.splice(index, 1)
  }
}

function getVideoList(sortType = 'created', reversed = false) {
  let videoList = videos.value
  // filter videos
  videoList = filterVideos(videoList)

  // sort videos
  if (sortType) {
    videoList = sortVideoList(videoList, sortType, reversed)
  }
  return videoList
}

function sortVideoList(videoList, sortType = 'created', reversed = false) {
  let sortFunc = getSortFunction(sortType)
  videoList = videoList.toSorted(sortFunc)
  if (reversed) {
    videoList.reverse()
  }
  return videoList
}

function filterVideos(videoList) {
  return videoList.filter((video) =>
    video.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
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
nav {
  display: flex;
  flex-direction: row;
  height: 70px;
  padding: 1em 1em;
  background-color: #eee;
  align-items: center;
}

.nav--title {
  font-size: 1.25em;
  font-weight: bold;
}

.nav--searchbar {
  padding: 0.5em;
  height: 2.5em;
  margin-right: 1em;
  margin-left: auto;

  display: flex;
  flex-direction: row;
  align-items: center;

  border: 1px solid #000000;
  border-radius: 4px;
}

.nav--searchbar-input {
  padding: 0;
  padding-left: 0.5em;
}

.nav--sortby {
  padding: 0.5em;
  height: 2.5em;
  margin-right: 1em;

  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: 4px;
  border: 1px solid #000000;
}
.nav--sortby-select {
  border: none;
}
.nav--sort-dir {
  padding: 0.5em;
  height: 2.5em;

  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: 4px;
  border: 1px solid #000000;
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
