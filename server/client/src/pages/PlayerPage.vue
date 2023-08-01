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

let actionMap
let activeAction
let oldIndependentAction = null
let independentActions = []
const fps = 1
let player
const route = useRoute()
const videoId = ref(route.params.id)

function seekToFrame(frame) {
  if (player !== undefined) {
    player.currentTime(frame / fps)
  }
}

function checkBoundingBox(event, action) {
  return (
    action.boundingBox.length === 4 &&
    event.pageX >= action.boundingBox[0] &&
    event.pageY >= action.boundingBox[1] &&
    event.pageX <= action.boundingBox[2] &&
    event.pageY <= action.boundingBox[3]
  )
}

function findAction(event, action, checkParent) {
  if (checkParent === undefined) {
    checkParent = true
  }

  // Check if the event is within the bounding box of this Action
  if (checkBoundingBox(event, action)) {
    return action
  }

  // Check if the event is within the bounding box of any children
  for (let index = 0; index < action.children.length; index++) {
    const child = action.children[index]
    if (checkBoundingBox(event, child)) {
      return child
    }

    if (child.type === 'toggle-off') {
      const result = findAction(event, child, false)
      if (result !== undefined) {
        return result
      }
    }
  }

  // Check if the event is within the bounding box of any indpendent actions
  for (let index = 0; index < independentActions.length; index++) {
    const independentAction = independentActions[index]
    if (checkBoundingBox(event, independentAction)) {
      return independentAction
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

  if (!['click', 'toggle', 'toggle-off', 'slider'].includes(newAction.type)) {
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

  if (newAction.independent) {
    oldIndependentAction = newAction
    seekToFrame(activeAction.position + newAction.idx)
  } else {
    activeAction = newAction
    seekToFrame(activeAction.position)
  }
}

function onHover(event) {
  const newAction = findAction(event, activeAction)

  // if there is a new action, and it is independent
  if (newAction !== undefined && newAction.independent) {
    if (newAction.type === 'hover') {
      oldIndependentAction = newAction
      seekToFrame(activeAction.position + newAction.idx)
    }
  }
  // if not an independent action
  else {
    // if there is a new action, and it is a hover
    if (newAction !== undefined && newAction.type === 'hover') {
      activeAction = newAction
      seekToFrame(activeAction.position)
    }
    // if there is no new action, and the current action is a hover
    else if (activeAction.type === 'hover') {
      activeAction = activeAction.parent
      seekToFrame(activeAction.position)
    }
    // if there is no new action, and the current action is independent and a hover
    else if (
      oldIndependentAction !== null &&
      oldIndependentAction.type === 'hover'
    ) {
      oldIndependentAction = null
      seekToFrame(activeAction.position)
    }
  }
}
const throttledHover = throttle(onHover, 100)

function addActionElements(action, parent, addIndependent = true) {
  if (parent !== undefined) {
    action.parent = parent
  } else {
    activeAction = action
  }

  if (
    action.boundingBox.length === 4 &&
    (action.type === 'click' ||
      action.type === 'toggle' ||
      action.type === 'slider')
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
  if (addIndependent) {
    for (let index = 0; index < independentActions.length; index++) {
      addActionElements(independentActions[index], action, false)
    }
  }
}

onMounted(() => {
  fetch(`/video/${videoId.value}/action-map/`)
    .then((response) => response.json())
    .then((_actionMap) => {
      actionMap = _actionMap
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

      independentActions = actionMap.independentActions
      for (let index = 0; index < independentActions.length; index++) {
        independentActions[index].idx = index + 1
      }
      addActionElements(actionMap)

      document.addEventListener('click', onClick)
      document.addEventListener('mousemove', throttledHover)
    })
})
</script>
