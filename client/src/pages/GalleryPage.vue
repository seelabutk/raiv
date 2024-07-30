<template>
  <v-layout>
    <v-app-bar elevation="0" color="grey-lighten-3">
      <!-- Title  -->
      <v-toolbar-title v-if="first_name.length > 0" class="font-weight-bold">
        Hi, {{ first_name }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Type -->
      <v-checkbox
        class="mr-4 nav--search-type"
        v-model="searchType"
        label="Smart Search"
        hide-details
      ></v-checkbox>

      <!-- Search Bar -->
      <v-text-field
        class="mr-4 nav--search-bar"
        variant="solo-filled"
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        density="compact"
        hide-details
        single-line
      ></v-text-field>


      <v-select
        class="mr-4 nav--view-by"
        prepend-inner-icon="mdi-eye"
        variant="solo-filled"
        v-model="viewType"
        density="compact"
        :items="orderByViews"
        item-value="value"
        item-title="text"
        label="View By"
        hide-details
        return-object
        single-line
      ></v-select>

      <!-- Order By Field -->
      <v-select
        class="mr-4 nav--sort-by"
        prepend-inner-icon="mdi-sort"
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
          <v-btn icon v-bind="props" @click="toggleSortDirection">
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
            <v-dialog v-model="searchDialog" activator="parent" width="400px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Image Search</span>
                </v-card-title>
                <v-card-text>
                  <v-file-input
                    v-model="imageSearchFile"
                    variant="solo-filled"
                    density="compact"
                    prepend-icon=""
                    prepend-inner-icon="mdi-image"
                    accept="image/*"
                    label="File input"
                    hide-details
                    single-line
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

      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="copyable" @click="copyApiKey">
            API Key (click to copy): {{ api_key }}
          </v-list-item>
          <v-list-item @click="logout">Logout</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!--Video Preview Gallery  -->
    <v-main>
      <v-container fluid class="pa-8">
        <v-row
          v-if="imageSearchResults.length > 0 || searchQuery.length > 0"
          class="px-4"
        >
          <span class="text-h5">Search Results</span>
          <v-spacer></v-spacer>
          <v-btn
            append-icon="mdi-close-box"
            variant="plain"
            @click="clearSearch"
          >
            Clear
          </v-btn>
          <v-divider></v-divider>
        </v-row>

        <v-row v-if="backToFoldersBtn">
          <v-col cols="12">
            <h1 v-if="showGroups" class="text-center" style="font-size: 30px;">Group {{ group_name }}</h1> 
            <h1 v-if="showUsers" class="text-center" style="font-size: 30px;">User {{ user_name }}</h1> 
            <v-tooltip text="Go Back">
            <template v-slot:activator="{ props }">
              <v-btn icon @click="toggleBackToFolderGroups" v-bind="props" color="black">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <ul v-if="folderGroupsShown && showGroups">
            <FolderContainer 
              v-for="videoList in groups"
              :key="videoList[0].groupName"
              :name="videoList[0].groupName"
              :videoList="videoList"
              @show="(chosenGroupVideoList) => showGroupVideoListOnly(chosenGroupVideoList, 'group')"
            ></FolderContainer>
          </ul>
          <ul v-else-if="folderGroupsShown && showUsers">
            <FolderContainer 
              v-for="videoList in users"
              :key="videoList[0].username"
              :name="videoList[0].username"
              :videoList="videoList"
              @show="(chosenGroupVideoList) => showGroupVideoListOnly(chosenGroupVideoList, 'user')"
            ></FolderContainer>
          </ul>
          <ul v-else>
            <PreviewCard
              v-for="video in filteredSortedVideos"
              :key="video.frame_no ? `${video.id}-${video.frame_no}` : video.id"
              :name="video.name"
              :username="video.username"
              :groupName="video.groupName"
              :video-id="video.id"
              :metadata="video.metadata"
              :frameNo="video.frame_no"
              @delete="deleteCard(video)"
              @rename="(newName) => renameVideo(video, newName)"
            ></PreviewCard>
          </ul>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
// import Cookies from 'js-cookie'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PreviewCard from '@/components/PreviewCard'
import FolderContainer from '@/components/FolderContainer'
import 'tippy.js/dist/tippy.css'
import { getSortFunction } from '@/utils/Sorts'

const router = useRouter()

const sortReversed = ref(false)
const videos = ref([])
const searchType = ref(false)
const searchQuery = ref('')
const searchDialog = ref(false)
const resultsLoading = ref(false)
const orderByViews = ref([
  { text: 'All Cards', value: 'allCards' },
  { text: 'User Name', value: 'username' },
  { text: 'Group Name', value: 'groupName' },
])
const orderByOptions = ref([
  { text: 'Video ID', value: 'id' },
  { text: 'Title', value: 'title' },
  { text: 'User Name', value: 'username' },
  { text: 'Group Name', value: 'groupName' },
  { text: 'Created', value: 'created' },
  { text: 'Updated', value: 'updated' },
  { text: 'File Size', value: 'size' },
])
const viewType = ref({ text: 'All Cards', value: 'allCards' })
const currentViewType = ref({ text: 'All Cards', value: 'allCards' })
const sortType = ref({ text: 'Created', value: 'created' })
const folderGroupsShown = ref(false)
const backToFoldersBtn = ref(false)
const groups = ref([])
const group_name = ref('')
const showGroups = ref(false)
const users = ref([])
const user_name = ref('')
const showUsers = ref(false)
const imageSearchFile = ref([])
const imageSearchResults = ref([])
const filteredSortedVideos = ref([])
const first_name = ref('')
const api_key = ref('')
watch(viewType, getFilteredAndSortedVideoList)
watch(sortType, getFilteredAndSortedVideoList)
watch(searchQuery, getFilteredAndSortedVideoList)
watch(searchType, getFilteredAndSortedVideoList)

function deleteCard(video) {
  const index = videos.value.indexOf(video)

  if (index >= 0) {
    videos.value.splice(index, 1)
  }

  getFilteredAndSortedVideoList()
}

function renameVideo(video, newName){
  video.name = newName
  fetch(`/video/${video.id}/action-map/${newName}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: api_key.value,
      newName: newName,
    }),
  })
}

function toggleSortDirection() {
  sortReversed.value = !sortReversed.value
  getFilteredAndSortedVideoList()
}

function getVideoList() {
  if (imageSearchResults.value.length > 0) {
    return imageSearchResults.value
  }
  return videos.value
}

async function getFilteredAndSortedVideoList() {
  resultsLoading.value = true
  backToFoldersBtn.value = false
  // retreive the proper video list
  let videoList = getVideoList()

  //Determines which user/group folders to show or just PreviewCards
  changeView()

  //Sort and filter videos based on pre-existing list or new compiled list
  if(showUsers.value || showGroups.value){
    if(user_name.value){
      videoList = videoList.filter(video => video.username.includes(user_name.value))
      videoList = await filterVideos(videoList)
      videoList = sortVideoList(videoList, sortType.value, sortReversed.value)
      filteredSortedVideos.value = videoList
    }
    else if(group_name.value){
      videoList = videoList.filter(video => video.groupName.includes(group_name.value))
      videoList = await filterVideos(videoList)
      videoList = sortVideoList(videoList, sortType.value, sortReversed.value)
      filteredSortedVideos.value = videoList
    }
    else{
      videoList = sortVideoList(videoList, sortType.value, sortReversed.value)
      let nameList = getNames(videoList, viewType.value.value)
      for(let i = 0; i < nameList.length; i++){
        if(showUsers.value){
          users.value[i] = videoList.filter((video) => {
            let index = video.username.indexOf(nameList[i])
            return index === 0 && video.username.length === nameList[i].length
          })
        }
        if(showGroups.value){
          groups.value[i] = videoList.filter((video) => {
            let index = video.groupName.indexOf(nameList[i])
            return index === 0 && video.groupName.length === nameList[i].length
          })
        }
      }
    }
  }
  //Regular filter and sort videoList if no folders
  else{
    videoList = await filterVideos(videoList)
    videoList = sortVideoList(videoList, sortType.value, sortReversed.value)
    filteredSortedVideos.value = videoList
  }
  resultsLoading.value = false
  return videoList    
}

function changeView(){
  if(viewType.value){
    //Reset values and hides/unhides elements
    switch(viewType.value.value){
        case 'groupName':
          showGroups.value = true
          if(currentViewType.value.value != 'groupName'){
            folderGroupsShown.value = true
            showUsers.value = false
            user_name.value = ''
            groups.value = []
          }
          else if(!folderGroupsShown.value){
            backToFoldersBtn.value = true
          }
          break
        case 'username':
          showUsers.value = true
          if(currentViewType.value.value != 'username'){
            folderGroupsShown.value = true
            showGroups.value = false
            group_name.value = ''
            users.value = []
          }
          else if(!folderGroupsShown.value){
            backToFoldersBtn.value = true
          }
          break
        default:
          folderGroupsShown.value = false
          showUsers.value = false
          showGroups.value = false
          user_name.value = ''
          group_name.value = ''
    }
    currentViewType.value = viewType.value
    //console.log("user: ", user_name.value)
    //console.log("group: ", group_name.value)
  }
}

function getNames(videoList, viewTypeVal){
  let vids = []
  for(let i = 0; i < videoList.length; i++){
      if(viewTypeVal === 'groupName' && vids.indexOf(videoList[i].groupName) === -1){
        vids.push(videoList[i].groupName)
      }
      else if(viewTypeVal === 'username' && vids.indexOf(videoList[i].username) === -1){
        vids.push(videoList[i].username)
      }
  }
  return vids
}

function showGroupVideoListOnly(chosenGroupVideoList, nameType){
  switch(nameType){
    case 'user':
      user_name.value = chosenGroupVideoList.value[0].username
      break
    case 'group':
      group_name.value = chosenGroupVideoList.value[0].groupName
      break
    
  }
  folderGroupsShown.value = false
  backToFoldersBtn.value = true
  filteredSortedVideos.value = chosenGroupVideoList.value
}

function toggleBackToFolderGroups(){
  backToFoldersBtn.value = false
  folderGroupsShown.value = true
  user_name.value = ''
  group_name.value = ''
  getFilteredAndSortedVideoList()
}

function sortVideoList(videoList, sortType = 'created', reversed = false) {
  let sortFunc = getSortFunction(sortType)
  videoList = videoList.toSorted(sortFunc)
  if (reversed) {
    videoList.reverse()
  }
  return videoList
}

function toggleDialog(value = undefined) {
  if (value === undefined) {
    searchDialog.value = !searchDialog.value
  } else {
    searchDialog.value = value
  }
}

async function filterVideos(videoList) {
  if (searchQuery.value.length === 0) {
    return videoList
  }

  if (searchType.value) {
    return await semanticSearch(videoList)
  } else {
    return textSearch(videoList)
  }
}

async function semanticSearch(videoList) {
  // filter by semantic search
  const nResults = 4
  const text = searchQuery.value.toLowerCase()
  const body = JSON.stringify({ text, nResults: nResults })
  const res = await fetch('/search/text/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body,
  }).then((res) => res.json())
  // Filter results
  const results = res.metadatas[0].map((video) => {
    const v = videoList.find((v) => v.id === video.video_id)
    return {
      id: v.id,
      name: v.name,
      metadata: v.metadata,
      frame_no: video.frame_no,
    }
  })
  return results
}

function textSearch(videoList) {
  // filter by text search
  return videoList.filter((video) =>
    video.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

function clearSearch() {
  // clear text bar search
  searchQuery.value = ''
  // clear image search
  imageSearchResults.value = []
  getFilteredAndSortedVideoList()
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
    return new Promise((resolve) => {
      reader.onload = (ev) => {
        resolve(ev.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
  const image = await getBase64(fileInput)
  imageSearchFile.value = []

  // Build query
  const nResults = 4
  const body = JSON.stringify({ image, nResults: nResults })
  const res = await fetch('/search/image/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body,
  }).then((res) => res.json())

  // Filter results
  imageSearchResults.value = res.metadatas[0].map((video) => {
    const v = videos.value.find((v) => v.id === video.video_id)
    return {
      id: v.id,
      name: v.name,
      metadata: v.metadata,
      frame_no: video.frame_no,
    }
  })
  getFilteredAndSortedVideoList()
}

function copyApiKey() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(api_key.value)
  } else {
    // no https workaround
    const textArea = document.createElement('textarea')
    textArea.style = 'opacity: 0;'
    document.body.appendChild(textArea)
    textArea.value = api_key.value
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Unable to copy to clipboard', err)
    }
    document.body.removeChild(textArea)
  }
}

function logout() {
  fetch('/auth/jwt/logout', { method: 'POST' })
  router.go()
}

onMounted(() => {
  fetch('/user/')
    .then((response) => {
      if (response.status === 401) {
        router.push('/account/login/')
      } else {
        return response.json()
      }
    })
    .then((data) => {
      api_key.value = data.api_key
      first_name.value = data.first_name

      if (data.save_key) {
        fetch('/users/me', {
          body: JSON.stringify({
            api_key: api_key.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })
      }
    })

  fetch('/video/')
    .then((response) => {
      if (response.status === 401) {
        router.push('/account/login/')
      } else {
        return response.json()
      }
    })
    .then((data) => {
      videos.value = data
      getFilteredAndSortedVideoList()
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

.nav--search-type {
  max-width: 150px;
}
.nav--search-bar {
  max-width: 300px;
}
.nav--sort-by {
  max-width: 200px;
}

.nav--view-by {
  max-width: 200px;
}

.copyable {
  cursor: pointer;
}
</style>
