<template>
  <router-link :to="`/player/${props.videoId}/`">
    <h2>{{ props.name }}</h2>
    <img :src="`/video/${props.videoId}/preview/`" />
    <div>
      <p>Created: {{ created }}</p>
      <!-- <span>Size: {{ props.metadata.size }}</span> -->
    </div>
    <div class="card--action-btns">
      <tippy content="Download Archive" content-class="tippy-tooltip">
        <button class="card--download" @click="downloadVideo">
          <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-download" />
        </button>
      </tippy>
      <tippy content="Delete Archive" content-class="tippy-tooltip">
        <button class="card--delete" @click="deleteVideo">
          <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-trash" />
        </button>
      </tippy>
    </div>
  </router-link>
</template>

<script setup>
import { defineEmits, defineProps, computed } from 'vue'
import 'tippy.js/dist/tippy.css'

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
})

const emit = defineEmits(['delete'])
const created = computed(() =>
  new Date(props.metadata.created).toLocaleString()
)

function downloadVideo() {
  // window.open(`/video/${props.videoId}/download/`)
}

function deleteVideo() {
  event.preventDefault()

  const apiKey = prompt(
    `To delete "${props.name}", please enter the API key used to generate it.`
  )

  if (!apiKey) {
    return
  }

  fetch(`/video/${props.videoId}/`, {
    headers: { Authorization: `Bearer ${apiKey}` },
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

<style scoped>
a {
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin: 1em;
  height: 300px;
  width: 300px;
  padding: 1em;
  position: relative;
}

h2 {
  margin-bottom: 0.5em;
  text-align: center;
}

img {
  height: 200px;
  overflow: hidden;
  border: 1px solid black;
  margin-bottom: 1em;
}

.card--action-btns {
  display: flex;
  flex-direction: row;
}

button {
  cursor: pointer;
  border-radius: 4px;
  padding: 0.5em;
  border: 1px solid #000000;
}

.card--download {
  background: #eeeeee;
  color: black;
}

.card--delete {
  background: red;
  color: white;
}
</style>
