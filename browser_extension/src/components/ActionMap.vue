<template>
  <div>
    <button
      type="button"
      :disabled="props.store.actionMap.value.root.frameCount < 2"
      @click="open"
    >
      View Action Map
    </button>

    <dialog class="action-map-dialog" v-drag="'#action-map-handle'">
      <div id="action-map-handle" class="handle">
        <font-awesome-icon class="fa-fw fa-lg" icon="fa-solid fa-grip" />

        <button class="close-btn" type="button" @click="close">
          <font-awesome-icon icon="fa-solid fa-xmark" class="fa-lg" />
        </button>
      </div>

      <NodeOptions
        ref="nodeOptions"
        :store="props.store"
        :action="currentAction"
        :title="nodeTitle"
        optionsClass="node-options-dialog"
        @render="render"
      />
    </dialog>
  </div>
</template>

<script setup>
/* global chrome */
import * as d3 from 'd3'
import { defineExpose, defineProps, onMounted, ref } from 'vue'

import NodeOptions from '@/components/NodeOptions'

const props = defineProps({
  store: {
    required: true,
    type: Object,
  },
})

let currentAction = ref(props.store.actionMap.value.root)
const nodeOptions = ref(null)
const nodeTitle = ref('Root')

const options = {
  dx: 64, // the distance between nodes on the x-axis
  dy: 128, // the distance between nodes on the y-axis
  height: 600, // the height of the svg
  iconSize: 20, // the height/width of the icon
  labelY: '0.32em', // this shifts the text label down
  nodeRadius: 16, // the size of each node's circle tag
  textOffset: 4, // the gap between the circle and text
  width: 600, // the width of the svg
}

let dialog
let dragging = false
const dragOrigin = {
  x: 0,
  y: 0,
}
let svg
let viewBox = [-options.dx, -options.height / 2, options.width, options.height]
let newViewBox = viewBox

function open() {
  dialog.show()
}

function close() {
  dialog.close()
}

function label(d) {
  if (d.data === undefined || d.data.target === undefined) {
    return 'Root'
  }

  const target = d.data.target
  let tagName = target.tagName.toLowerCase()

  // Add the element's ID for easy identification
  if (target.id !== '') {
    tagName += `#${target.id}`
  }

  // Add the element's classList for additional context
  const classes = [...target.classList].filter(
    (className) => !className.startsWith('raiv')
  )
  if (classes.length > 0) {
    tagName += `.${classes.join('.')}`
  }

  return tagName
}

// Renders the action tree into an SVG
function render() {
  // Remove the old SVG
  svg.selectAll('*').remove()

  // Recompute the layout for the new tree structure
  const tree = d3.hierarchy(props.store.actionMap.value.root)
  d3.tree().nodeSize([options.dx, options.dy])(tree)

  // Resets the viewBox on a new render
  // svg.attr('viewBox', viewBox)

  // Draw the links between nodes
  svg
    .append('g')
    .attr('stroke', 'black')
    .attr('fill', 'white')
    .selectAll('path')
    .data(tree.links())
    .join('path')
    .attr(
      'd',
      d3
        .link(d3.curveBumpX)
        .x((d) => d.y)
        .y((d) => d.x)
    )

  // Create the node containers
  const node = svg
    .append('g')
    .selectAll('g')
    .data(tree.descendants())
    .join('g')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)
    .style('stroke', (d) => {
      if (props.store.actionMap.value.parentActions.includes(d.data)) {
        return 'green'
      }

      return 'black'
    })
    .style('cursor', 'pointer')
    .on('pointerover', (_, d) => {
      const target = d.data.target

      if (target !== undefined) {
        target.classList.add('raiv-selected')
      }
    })
    .on('pointerleave', (_, d) => {
      const target = d.data.target

      if (target !== undefined) {
        target.classList.remove('raiv-selected')
      }
    })
    .on('click', function (event, d) {
      if (nodeOptions.value.isChangeParent && d.data !== currentAction.value) {
        props.store.actionMap.value.changeParent(currentAction.value, d.data)
        props.store.save()
        nodeOptions.value.isChangeParent = false
        render()
      } else if (d.data.parent !== undefined) {
        nodeTitle.value = label(d)
        currentAction.value = d.data
        nodeOptions.value.open()
      }
    })
    .on('contextmenu', function (event, d) {
      event.preventDefault()

      const parentActions = props.store.actionMap.value.parentActions
      const index = parentActions.indexOf(d.data)

      if (index === -1) {
        d3.select(this).style('stroke', 'green')
        props.store.actionMap.value.addParent(d.data)
      } else if (parentActions.length > 1) {
        d3.select(this).style('stroke', 'black')
        props.store.actionMap.value.removeParent(index)
      }
    })

  // Draw the nodes inside their containers
  node.append('circle').attr('r', options.nodeRadius).attr('fill', 'white')

  // Draw the fa icons inside of the circles
  node
    .append('image')
    .attr('href', (d) => {
      const type = d.data.type

      if (type === 'click') {
        return chrome.runtime.getURL('/icons/hand-pointer-solid.svg')
      } else if (type === 'hover') {
        return chrome.runtime.getURL('/icons/arrow-pointer-solid.svg')
      } else if (type === 'toggle') {
        return chrome.runtime.getURL('/icons/toggle-on-solid.svg')
      } else if (type === 'toggle-off') {
        return chrome.runtime.getURL('/icons/toggle-off-solid.svg')
      }
    })
    .attr('height', options.iconSize)
    .attr('width', options.iconSize)
    .attr('x', -options.iconSize / 2)
    .attr('y', -options.iconSize / 2)

  // Draw the labels
  node
    .append('text')
    .text((d) => label(d))
    .attr('x', options.nodeRadius + options.textOffset)
    .attr('dy', options.labelY)

  dialog.appendChild(svg.node())
}

// Panning initialization
function onPointerDown(event) {
  dragging = true

  dragOrigin.x = event.clientX
  dragOrigin.y = event.clientY

  svg.style('cursor', 'grabbing')
}

// Panning handler
function onPointerMove(event) {
  if (!dragging) {
    return
  }

  event.preventDefault()

  svg.attr('viewBox', [
    newViewBox[0] - (event.clientX - dragOrigin.x),
    newViewBox[1] - (event.clientY - dragOrigin.y),
    newViewBox[2],
    newViewBox[3],
  ])
}

// Panning clean up
function onPointerUp() {
  dragging = false

  newViewBox = svg
    .attr('viewBox')
    .split(',')
    .map((val) => Number(val))

  svg.style('cursor', 'grab')
}

onMounted(() => {
  dialog = document.querySelector('.action-map-dialog')
  svg = d3
    .create('svg')
    .attr('height', `${options.height}px`)
    .attr('width', `${options.width}px`)
    .style('cursor', 'grab')
    .on('pointerdown', onPointerDown)
    .on('pointerleave', onPointerUp)
    .on('pointermove', onPointerMove)
    .on('pointerup', onPointerUp)

  render()
})

// TODO: It would be nice to render only as needed without having parents
// make this call, but reactivity is being lost in the properties of the
// Object passed in. Even if reactivity can be properly established, this
// render likely needs to be throttled to avoid many render calls when
// performing an action that affects many nodes.
defineExpose({ render })
</script>

<style scoped>
.action-map-dialog {
  left: -10em;
  top: 1em;
  z-index: 10001;
}
</style>
