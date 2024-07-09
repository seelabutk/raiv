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
        :src="`/video/${props.videoId}/preview/`"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,1)"
        height="200"
        cover
      >
        <v-card-title class="text-white">{{ props.name }}</v-card-title>
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

      <v-tooltip text="Rename" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" size="small">
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
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-share-variant"
            size="small"
            @click="shareVideo"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Download" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-download"
            size="small"
            @click="downloadVideo"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Delete" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            color="red"
            icon="mdi-delete"
            size="small"
            @click="deleteVideo"
          />
        </template>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'

const props = defineProps({
  name: {
    required: true,
    type: String,
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
})

const emit = defineEmits(['delete', 'rename'])
const shareText = ref('Share')
const renameDialog = ref(false)
const newName = ref('')

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

function deleteVideo() {
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
}
</script>
