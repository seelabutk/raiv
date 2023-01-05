<template>
  <div class="player">
    <img :src="`/video/${videoId}/preview/`" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const videoId = ref(route.params.id)

function addActionElements(node) {
  if (node.boundingBox !== undefined) {
    const div = document.createElement('div')

    if (node.action === 'click') {
      div.style.cursor = 'pointer'
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

fetch(`/video/${videoId.value}/action-map/`)
  .then((response) => response.json())
  .then((actionMap) => {
    const player = document.querySelector('.player')

    player.style.height = `${actionMap.height}px`
    player.style.width = `${actionMap.width}px`

    addActionElements(actionMap)
  })

fetch(`/video/${videoId.value}/video`)
  .then((response) => response.blob())
  .then((video) => {
    console.log('video', video)
  })
</script>
