<template>
  <v-card min-width="300" max-width="300" class="ma-4">
    <router-link
      :to="
        props.frameNo === undefined
          ? `/player/${props.videoId}/`
          : `/player/${props.videoId}/${props.frameNo}/`
      "
    >
      <v-img
        v-if="!showVideoDetalis"
        :src="`/video/${props.videoId}/preview/`"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,1)"
        height="200"
        cover
        @mouseover="hoverVideoDetails"
      >
        <v-card-title class="text-white">{{ props.name }}</v-card-title>
      </v-img>

      <v-img
        v-else
        :src="`/video/${props.videoId}/preview/`"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.7), rgba(0,0,0,1)"
        height="200"
        cover
        @mouseleave="hideVideoDetails"
      >
        <v-card-text class="text-white">
          Title: {{ props.name }}<br>
          ID: {{ props.videoId }}<br>
          User name: {{ props.username }}<br>
          Group name: {{ props.groupName }}<br>
          Is Public: {{ props.isPublic }}<br>
          Created: {{ props.metadata.created }}<br>
          Updated: {{ props.metadata.updated }}<br>
          File size: {{ humanFileSize(props.metadata.size) }}<br>
        </v-card-text>
      </v-img>
    </router-link>

    <v-card-actions>
      <span
        v-if="props.frameNo !== undefined && props.frameNo !== null"
        class="mr-2"
      >
        Frame {{ props.frameNo }}
      </span>
      <v-spacer />

      <!-- Only show rename button if user is owner -->
      <v-tooltip v-if="props.isOwner" text="Rename" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn icon v-bind="tooltipProps" size="small">
            <v-icon>mdi-rename</v-icon>
            <v-dialog v-model="renameDialog" activator="parent" width="400px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Rename Video</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="newName" label="Name" variant="outlined"></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="toggleDialog(false)">Close</v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="renameVideo(newName)">Rename</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="shareText" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon="mdi-share-variant"
            size="small"
            @click="shareVideo"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Download" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon="mdi-download"
            size="small"
            @click="downloadVideo"
          />
        </template>
      </v-tooltip>

      <!-- Only show delete button if user is owner -->
      <v-tooltip v-if="props.isOwner" text="Delete" location="bottom">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            color="red"
            icon="mdi-delete"
            size="small"
            @click="openDeleteDialog"
          />
        </template>
      </v-tooltip>
    </v-card-actions>
  </v-card>
  
  <!-- Delete confirmation dialog -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5">Delete Video</v-card-title>
      <v-card-text>
        Are you sure you want to delete "{{ props.name }}"? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="red" variant="text" @click="confirmDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
import { humanFileSize } from '@/utils/HumanFileSize'

const props = defineProps({
  name: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  groupName: {
    required: true,
    type: String,
  },
  isPublic: {
    required: true,
    type: Boolean,
  },
  videoId: {
    required: true,
    type: String,
  },
  metadata: {
    required: true,
    type: Object,
  },
  frameNo: {
    required: false,
    type: Number,
  },
  // New prop to determine if current user is the owner
  isOwner: {
    required: false,
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete', 'rename'])
const shareText = ref('Share')
const renameDialog = ref(false)
const deleteDialog = ref(false)
const newName = ref('')
const showVideoDetalis = ref(false)

//Rename text field prefills the current video name
onMounted(() => {
  newName.value = props.name
})

function hoverVideoDetails() {
  showVideoDetalis.value = true
}

function hideVideoDetails(){
  showVideoDetalis.value = false
}

function shareVideo() {
  navigator.clipboard.writeText(
    new URL(`/player/${props.videoId}/`, window.location.origin).href
  )

  shareText.value = 'Copied to clipboard!'
  setTimeout(() => {
    shareText.value = 'Share'
  }, 2000)
}

function renameVideo(newName) {
  emit('rename', newName)
  renameDialog.value = false
}

function toggleDialog(value = undefined) {
  if (value === undefined) {
    renameDialog.value = !renameDialog.value
  } else {
    renameDialog.value = false
  }
}

function downloadVideo() {
  window.open(`/video/${props.videoId}/download/`)
}

function openDeleteDialog() {
  deleteDialog.value = true
}

function confirmDelete() {
  fetch(`/video/${props.videoId}/`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.status >= 200 && response.status <= 299) {
      emit('delete', props.videoId)
    } else {
      alert('Failed to delete video. Please try again.')
    }
  }).catch(error => {
    console.error('Error deleting video:', error)
    alert('An error occurred while trying to delete the video.')
  }).finally(() => {
    deleteDialog.value = false
  })
}


/*function deleteVideo() {
  const apiKey = prompt(
    `To delete "${props.name}", please enter the API key used to generate it.`
  )

  if (!apiKey) {
    return
  }

  fetch(`/video/${props.videoId}/`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.status >= 200 && response.status <= 299) {
      emit('delete', props.videoId)
    } else {
      alert('Invalid API key.')
    }
  })
}*/

</script>