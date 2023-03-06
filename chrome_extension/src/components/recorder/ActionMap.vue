<template>
  <div>
    <button
      type="button"
      :disabled="actionMap.value.frameCount < 2"
      @click="open"
    >
      View Action Map
    </button>

    <dialog class="action-map-dialog">
      <button class="close-btn" type="button" @click="close">
        <font-awesome-icon icon="fa-solid fa-xmark" class="fa-2x" />
      </button>
    </dialog>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { defineExpose, defineProps, onMounted } from 'vue'

const props = defineProps({
  actionMap: {
    required: true,
    type: Object,
  },
})

const options = {
  dx: 32, // the distance between nodes on the x-axis
  dy: 64, // the distance between nodes on the y-axis
  height: 600, // the height of the svg
  labelY: '0.32em', // this shifts the text label down
  nodeRadius: 8, // the size of each node's circle tag
  textOffset: 4, // the gap between the circle and text
  width: 400, // the width of the svg
}

let dialog = null
let dragging = false
const dragOrigin = {
  x: 0,
  y: 0,
}
let svg = null
let viewBox = [-options.width / 2, -options.dy, options.width, options.height]
let newViewBox = viewBox

function open() {
  dialog.show()
}

function close() {
  dialog.close()
}

function label(d) {
  if (d.data.target === undefined) {
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
  const tree = d3.hierarchy(props.actionMap.value.root)
  d3.tree().nodeSize([options.dx, options.dy])(tree)

  // Resets the viewBox on a new render
  svg.attr('viewBox', viewBox)

  // Draw the links between nodes
  svg
    .append('g')
    .attr('stroke', 'black')
    .selectAll('path')
    .data(tree.links())
    .join('path')
    .attr(
      'd',
      d3
        .link(d3.curveBumpX)
        .x((d) => d.x)
        .y((d) => d.y)
    )

  // Create the node containers
  const node = svg
    .append('g')
    .selectAll('g')
    .data(tree.descendants())
    .join('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
    .style('cursor', 'pointer')

  // Draw the nodes inside their containers
  node.append('circle').attr('fill', 'black').attr('r', options.nodeRadius)

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
  height: fit-content;
  position: fixed;
  margin-right: 1em;
  top: 1em;
  width: fit-content;
  z-index: 1001;
}

.close-btn {
  position: absolute;
  right: 0.5em;
  top: 0.5em;
}
</style>
