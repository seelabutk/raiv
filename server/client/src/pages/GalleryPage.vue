<template>
  <!-- <nav> -->
  <!-- https://vuetifyjs.com/en/api/v-toolbar/ -->
  <v-toolbar class="pa-4" flat height="70px" elevation="0">
    <!-- Title  -->
    <v-toolbar-title>RAIV Gallery</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Search Bar -->
    <v-text-field
      class="mr-4"
      variant="solo-filled"
      v-model="searchQuery"
      prepend-icon="mdi-magnify"
      placeholder="Search"
      density="compact"
      hide-details
      single-line
    ></v-text-field>

    <!-- Order By Field -->

    <!-- https://vuetifyjs.com/en/api/v-select/ -->
    <v-select
      class="mr-4"
      variant="solo-filled"
      v-model="sortType"
      density="compact"
      :items="orderByOptions"
      item-value="value"
      item-title="text"
      label="Sort By"
      hide-details
      return-object
      single-line
    ></v-select>

    <!-- Order Direction -->
    <v-tooltip
      :text="sortReversed ? 'Order Ascending' : 'Order Descending'"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          class="mr-4"
          v-bind="props"
          @click="sortReversed = !sortReversed"
        >
          <v-icon v-if="sortReversed">mdi-arrow-up</v-icon>
          <v-icon v-if="!sortReversed">mdi-arrow-down</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- Image Search -->
    <v-tooltip text="Image Search" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-image-search</v-icon>
          <v-dialog 
          v-model="searchDialog" 
          activator="parent" width="400px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Image Search</span>
              </v-card-title>
              <v-card-text>
                  <v-file-input
                    v-model="imageSearchFile"
                    variant="solo-filled"
                    prepend-icon="mdi-image"
                    accept="image/*"
                    label="File input"
                  ></v-file-input>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="toggleDialog(false)"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="imageSearch()"
                >
                  Search
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
      </template>
    </v-tooltip>
  </v-toolbar>

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

// const sortType = ref('created')
const sortReversed = ref(false)
const videos = ref([])
const searchQuery = ref('')
const searchDialog = ref(false)
const orderByOptions = ref([
  { text: 'Created', value: 'created' },
  { text: 'Updated', value: 'updated' },
  { text: 'File Size', value: 'size' },
  { text: 'Title', value: 'title' },
])
const sortType = ref({ text: 'Created', value: 'created' })
const imageSearchFile = ref([])

function deleteCard(video) {
  const index = videos.value.indexOf(video)

  if (index >= 0) {
    videos.value.splice(index, 1)
  }
}

function getVideoList(
  sortType = { text: 'Created', value: 'created' },
  reversed = false
) {
  let videoList = videos.value
  // filter videos
  videoList = filterVideos(videoList)

  // sort videos
  if (sortType) {
    videoList = sortVideoList(videoList, sortType.value, reversed)
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

function toggleDialog(value=undefined) {
  if (value === undefined) {
    searchDialog.value = !searchDialog.value
  } else {
    searchDialog.value = value
  }
}

function filterVideos(videoList) {
  return videoList.filter((video) =>
    video.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

async function imageSearch() {
  toggleDialog(false)
  // Do nothing if no file uploaded
  if (imageSearchFile.value.length === 0) {
    return
  }
  
  // Get file input and clear the form
  const fileInput = imageSearchFile.value[0]
  function getBase64(file) {
    const reader = new FileReader()
    return new Promise(resolve => {
      reader.onload = ev => {
        resolve(ev.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
  const image = await getBase64(fileInput)
  imageSearchFile.value = []

  // Build query
  const nResults = 1
  const body = JSON.stringify({ image, nResults:nResults })
  const res = await fetch('/search/image/', {
    method: "POST",
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body
  }).then(res => res.json())

  // Filter results 
  videoList = res.metadatas[0]
  videoList = videoList.map(video => {
    const v = videos.value.find(v => v.id === video.video_id)
    v.frame_no = video.frame_no
    return v
  })
  console.log(videoList)

  // TODO - Display video list to the user
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
