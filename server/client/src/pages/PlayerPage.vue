<template>
  <div class="player">
    <video id="loom-video" class="video-js" preload="auto" muted>
      <source :src="`/video/${videoId}/video/`" type="video/mp4" />
    </video>
  </div>
</template>

<script setup>
import throttle from 'lodash.throttle'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

let activeAction
const fps = 1
let player
const route = useRoute()
const videoId = ref(route.params.id)

function seekToFrame(frame) {
  if (player !== undefined) {
    player.currentTime(frame / fps)
  }
}

function findAction(event, action, checkParent) {
  if (checkParent === undefined) {
    checkParent = true
  }

  if (
    action.boundingBox.length === 4 &&
    event.clientX >= action.boundingBox[0] &&
    event.clientY >= action.boundingBox[1] &&
    event.clientX <= action.boundingBox[2] &&
    event.clientY <= action.boundingBox[3]
  ) {
    return action
  }

  for (let index = 0; index < action.children.length; index++) {
    const child = action.children[index]
    if (
      child.boundingBox.length === 4 &&
      event.clientX >= child.boundingBox[0] &&
      event.clientY >= child.boundingBox[1] &&
      event.clientX <= child.boundingBox[2] &&
      event.clientY <= child.boundingBox[3]
    ) {
      return child
    }

    if (child.type === 'toggle-off') {
      const result = findAction(event, child, false)
      if (result !== undefined) {
        return result
      }
    }
  }

  // if this Action has a valid ancestor, we can check it for matches
  const ancestor =
    action.disableSiblings && action.parent !== undefined
      ? action.parent.parent
      : action.parent
  if (checkParent && ancestor !== undefined) {
    return findAction(event, ancestor)
  }
}

// returns a list of indices to navigate from a parent to a child
function getIndexPath(parent, target) {
  if (parent === target) {
    return []
  }

  for (let index = 0; index < parent.children.length; index++) {
    const child = parent.children[index]

    if (child === target) {
      return [index]
    }

    // If the target is a descendant of this child, then add the current index to the path.
    const result = getIndexPath(child, target)
    if (result.length > 0) {
      return [index].concat(result)
    }
  }

  return []
}

function onClick(event) {
  let newAction = findAction(event, activeAction)

  if (newAction === undefined) {
    return
  }

  if (!['click', 'toggle', 'toggle-off'].includes(newAction.type)) {
    return
  }

  if (newAction.type === 'toggle' || newAction.type === 'toggle-off') {
    const indexPath = getIndexPath(newAction, activeAction)

    if (newAction === activeAction || indexPath.length > 0) {
      // Toggles need to be switched to their sibling state!
      let childIndex = newAction.parent.children.indexOf(newAction)
      if (newAction.type === 'toggle') {
        childIndex++
      } else if (newAction.type === 'toggle-off') {
        childIndex--
      }

      newAction = newAction.parent.children[childIndex]

      if (newAction.type === 'toggle' || newAction.type === 'toggle-off') {
        for (let index = 0; index < indexPath.length; index++) {
          if (newAction.children[indexPath[index]] !== undefined) {
            newAction = newAction.children[indexPath[index]]
          }
        }
      }
    }
  }

  activeAction = newAction
  seekToFrame(activeAction.position + 1)
}

function onHover(event) {
  const newAction = findAction(event, activeAction)

  if (newAction !== undefined && newAction.type === 'hover') {
    activeAction = newAction
    seekToFrame(activeAction.position + 1)
  } else if (activeAction.type === 'hover') {
    activeAction = activeAction.parent
    seekToFrame(activeAction.position + 1)
  }
}
const throttledHover = throttle(onHover, 100)

function addActionElements(action, parent) {
  if (parent !== undefined) {
    action.parent = parent
  } else {
    activeAction = action
  }

  if (
    action.boundingBox.length === 4 &&
    (action.type === 'click' || action.type === 'toggle')
  ) {
    const div = document.createElement('div')
    div.style.cursor = 'pointer'
    div.style.position = 'absolute'
    div.style.left = `${action.boundingBox[0]}px`
    div.style.top = `${action.boundingBox[1]}px`
    div.style.height = `${action.boundingBox[3] - action.boundingBox[1]}px`
    div.style.width = `${action.boundingBox[2] - action.boundingBox[0]}px`

    document.body.appendChild(div)
  }

  for (let index = 0; index < action.children.length; index++) {
    addActionElements(action.children[index], action)
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

      document.addEventListener('click', onClick)
      document.addEventListener('mousemove', throttledHover)
    })
})
</script>
