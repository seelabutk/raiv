<template>
  <router-link :to="`/player/${props.videoId}/`">
    <h2>{{ props.name }}</h2>
    <img :src="`/video/${props.videoId}/preview/`" />
    <div>
      <p>Created : {{ created }}</p>
      <p>Updated : {{ updated }}</p>
      <p>File Size : {{ fileSize }}</p>
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

// Format Archive metadata
const created = computed(() =>
  new Date(props.metadata.created).toLocaleString()
)
const updated = computed(() =>
  new Date(props.metadata.updated).toLocaleString()
)
const fileSize = computed(() => humanFileSize(props.metadata.size))

function downloadVideo() {
  event.preventDefault()
  window.open(`/video/${props.videoId}/download/`)
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

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  )

  return bytes.toFixed(dp) + ' ' + units[u]
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
