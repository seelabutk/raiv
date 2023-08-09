<template>
  <div class="action-map-dialog"></div>
</template>

<script setup>
/* global chrome */
import * as d3 from 'd3'
import { defineExpose, defineProps, onMounted, computed } from 'vue'

const props = defineProps({
  actionMap: {
    required: true,
    type: Object,
  },
  currentAction: {
    required: true,
    type: Object,
  },
  setCurrentAction: {
    required: true,
    type: Function,
  },
})

let currentAction = computed(() => props.currentAction)
// let currentAction = ref(props.store.actionMap.value.root)
// const nodeOptions = ref(null)
// const nodeTitle = ref('Root')

const options = {
  dx: 64, // the distance between nodes on the x-axis
  dy: 128, // the distance between nodes on the y-axis
  height: screen.height, // the height of the svg
  // height: 600, // the height of the svg
  iconSize: 20, // the height/width of the icon
  labelY: '0.32em', // this shifts the text label down
  nodeRadius: 16, // the size of each node's circle tag
  textOffset: 4, // the gap between the circle and text
  width: screen.width, // the width of the svg
  // width: 600, // the width of the svg
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

function label() {
  return 'label'
}

// Renders the action tree into an SVG
function render() {
  // Remove the old SVG
  svg.selectAll('*').remove()

  // Recompute the layout for the new tree structure
  const tree = d3.hierarchy(props.actionMap)
  d3.tree().nodeSize([options.dx, options.dy])(tree)

  // Resets the viewBox on a new render
  svg.attr('viewBox', viewBox)

  // Draw the links between nodes
  svg
    .append('g')
    .attr('stroke', 'white')
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
      if (d.data === currentAction.value) {
        return 'green'
      }
      return 'red'
    })
    .style('cursor', 'pointer')
    .on('click', function (event, d) {
      props.setCurrentAction(d.data)
      d3.select(this).style('stroke', 'green')
      render()
    })
    .on('contextmenu', function (event) {
      event.preventDefault()
    })

  // Draw the nodes inside their containers
  node.append('circle').attr('r', options.nodeRadius).attr('fill', 'white')

  // Draw the fa icons inside of the circles
  // node
  //   .append('image')
  //   .attr('href', (d) => {
  //     const type = d.data.type

  //     if (type === 'click') {
  //       return chrome.runtime.getURL('/icons/hand-pointer-solid.svg')
  //     } else if (type === 'hover') {
  //       return chrome.runtime.getURL('/icons/arrow-pointer-solid.svg')
  //     } else if (type === 'toggle') {
  //       return chrome.runtime.getURL('/icons/toggle-on-solid.svg')
  //     } else if (type === 'toggle-off') {
  //       return chrome.runtime.getURL('/icons/toggle-off-solid.svg')
  //     }
  //   })
  //   .attr('height', options.iconSize)
  //   .attr('width', options.iconSize)
  //   .attr('x', -options.iconSize / 2)
  //   .attr('y', -options.iconSize / 2)

  // Draw the labels
  node
    .append('text')
    .text((d) => label(d))
    .style('fill', 'white')
    .attr('x', options.nodeRadius + options.textOffset)
    .attr('dy', options.labelY)
    .selectAll('text')

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
