<template>
  <div class="player">
    <video id="loom-video" class="video-js" preload="auto" muted>
      <source :src="`/video/${videoId}/video/`" type="video/mp4" />
    </video>
  </div>
</template>

<script setup>
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const fps = 30
let player = null
const route = useRoute()
const videoId = ref(route.params.id)

function seekToFrame(frame) {
  if (player !== null) {
    player.currentTime(frame / fps)
  }
}

function addActionElements(node) {
  if (node.boundingBox !== undefined) {
    const div = document.createElement('div')

    if (node.action === 'click') {
      div.style.cursor = 'pointer'

      div.addEventListener('click', () => {
        seekToFrame(node.position + 1)
      })
    } else if (node.action === 'hover') {
      div.addEventListener('mouseover', () => {
        seekToFrame(node.position + 1)
      })
    }

    div.style.position = 'absolute'
    div.style.left = `${node.boundingBox[0]}px`
    div.style.top = `${node.boundingBox[1]}px`
    div.style.height = `${node.boundingBox[3] - node.boundingBox[1]}px`
    div.style.width = `${node.boundingBox[2] - node.boundingBox[0]}px`

    document.body.appendChild(div)
  }

  for (let index = 0; index < node.children.length; index++) {
    addActionElements(node.children[index])
  }
}

onMounted(() => {
  fetch(`/video/${videoId.value}/action-map/`)
    .then((response) => response.json())
    .then((actionMap) => {
      const container = document.querySelector('.player')
      const videoElement = document.querySelector('#loom-video')

      container.style.height = `${actionMap.height}px`
      container.style.width = `${actionMap.width}px`
      videoElement.style.height = `${actionMap.height}px`
      videoElement.style.width = `${actionMap.width}px`

      player = videojs('loom-video')
      player.ready(() => {
        player.currentTime(0)

        player.on('click', (event) => {
          event.preventDefault()
        })
      })

      addActionElements(actionMap)
    })
})
</script>
