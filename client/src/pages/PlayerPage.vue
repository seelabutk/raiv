<template>
  <div>
    <ActionExplorer
      ref="actionExplorer"
      :actionMap="actionMap"
      :currentAction="activeAction"
      :setCurrentAction="setCurrentAction"
      :showPath="showPath"
    />
    <div class="player" ref="playRegion">
      <video id="loom-video" class="video-js" preload="auto" muted>
        <source :src="`/video/${videoId}/video/`" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script setup>
import throttle from 'lodash.throttle'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ActionExplorer from '@/components/ActionExplorer'

let actionMap = ref({});
let activeAction = ref({});
let oldIndependentAction = null;
let independentActions = [];
const showPath = ref(false);
const actionExplorer = ref(null);
const playRegion = ref(null);
const fps = 1;
let player;
const route = useRoute();
const videoId = ref(route.params.id);
const initFrameNo = ref(route.params.frameNo);

function setCurrentAction(action) {
  if (action !== undefined) {
    if (action.independent) {
      oldIndependentAction = action
      seekToFrame(activeAction.value.ID + action.idx)
    } else {
      activeAction.value = action
      seekToFrame(action.ID)
    }
  }
}

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
  let newAction = findAction(event, activeAction.value)

  if (newAction === undefined) {
    return
  }

  if (!['click', 'toggle', 'toggle-off', 'slider'].includes(newAction.type)) {
    return
  }

  if (newAction.type === 'toggle' || newAction.type === 'toggle-off') {
    const indexPath = getIndexPath(newAction, activeAction)

    if (newAction === activeAction.value || indexPath.length > 0) {
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
    seekToFrame(activeAction.value.ID + newAction.idx)
  } else {
    activeAction.value = newAction
    seekToFrame(activeAction.value.ID)
  }
}

function onHover(event) {
  const newAction = findAction(event, activeAction.value);

  if(newAction !== undefined && ['click', 'toggle', 'toggle-off', 'hover', 'slider'].includes(newAction.type)){
    playRegion.value.style.cursor = 'pointer';
  } else {
    playRegion.value.style.cursor = 'default';
  }

  // if there is a new action, and it is independent
  if (newAction !== undefined && newAction.independent) {
    if (newAction.type === 'hover') {
      oldIndependentAction = newAction
      seekToFrame(activeAction.value.ID + newAction.idx)
    }
  }
  // if not an independent action
  else {
    // if there is a new action, and it is a hover
    if (newAction !== undefined && newAction.type === 'hover') {
      activeAction.value = newAction
      seekToFrame(activeAction.value.ID)
    }
    // if there is no new action, and the current action is a hover
    else if (activeAction.value.type === 'hover') {
      activeAction.value = activeAction.value.parent
      seekToFrame(activeAction.value.ID)
    }
    // if there is no new action, and the current action is independent and a hover
    else if (
      oldIndependentAction !== null &&
      oldIndependentAction.type === 'hover'
    ) {
      oldIndependentAction = null
      seekToFrame(activeAction.value.ID)
    }
  }
}
const throttledHover = throttle(onHover, 100)

function findActionByFrame(frame) {
  const root = actionMap.value.root
  let minClosestFrame = 0
  let minClosestAction = root

  const dfs = (action) => {
    if (action.ID <= frame) {
      if (action.ID > minClosestFrame) {
        minClosestFrame = action.ID
        minClosestAction = action
      }
    }

    if (action.ID === frame) {
      return action
    }

    for (let index = 0; index < action.children.length; index++) {
      const result = dfs(action.children[index])
      if (result !== undefined) {
        return result
      }
    }

    return undefined
  }
  let action = dfs(root)

  // if action is undefined, then it is an independent action
  if (action === undefined) {
    activeAction.value = minClosestAction
    const diff = frame - minClosestFrame
    oldIndependentAction = independentActions[diff - 1]
  } else {
    activeAction.value = action
  }
}

function addActionElements(action, parent, addIndependent = true) {
  if (parent !== undefined) {
    action.parent = parent
  } else {
    activeAction.value = action
  }

  //assign defaults if not present
  if(action.children === undefined) action.children = [];
  if(action.disableSiblings === undefined)  action.disableSiblings = false;
  if(action.independent === false)  action.independent = false;
  
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
      actionMap.value = _actionMap

      independentActions = actionMap.value.independentActions
      for (let index = 0; index < independentActions.length; index++) {
        independentActions[index].idx = index + 1
      }
      addActionElements(actionMap.value.root);

      document.addEventListener('click', onClick)
      document.addEventListener('mousemove', throttledHover)

      player = videojs('loom-video')
      player.ready(() => {
        player.currentTime(0)

        player.on('click', (event) => {
          event.preventDefault()
        })
        // If given an initial frame number, seek to that frame, and update the current action
        if (initFrameNo.value !== undefined) {
          findActionByFrame(parseInt(initFrameNo.value))
          seekToFrame(parseInt(initFrameNo.value))
          showPath.value = true
        }
      })
    })
})
</script>
