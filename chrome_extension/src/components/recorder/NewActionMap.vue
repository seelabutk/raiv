<template>
  <div>
    <button type="button" :disabled="actionMap.frameCount < 2" @click="open">
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
import { defineProps, onMounted } from 'vue'

const props = defineProps({
  actionMap: {
    required: true,
    type: Object,
  },
})

let dialog = null
let svg = null

function open() {
  dialog.show()
}

function close() {
  dialog.close()
}

function render() {
  svg.textContent = ''

  const tree = d3.hierarchy(props.actionMap.root)
  d3.tree().nodeSize([32, 32])(tree)

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

  const node = svg
    .append('g')
    .selectAll('a')
    .data(tree.descendants())
    .join('a')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  node
    .append('circle')
    .attr('fill', 'black')
    .attr('r', 8)
    .style('cursor', 'pointer')

  dialog.appendChild(svg.node())
}

onMounted(() => {
  dialog = document.querySelector('.action-map-dialog')
  svg = d3
    .create('svg')
    .attr('viewBox', [-200, -10, 400, 600])
    .attr('height', '100%')
    .attr('width', '100%')

  render()
})
</script>

<style scoped>
.action-map-dialog {
  height: 600px; /* TODO: fix */
  position: fixed;
  margin-right: 1em;
  top: 1em;
  width: 400px; /* TODO: fix */
  z-index: 1001;
}

.close-btn {
  position: absolute;
  right: 0.5em;
  top: 0.5em;
}
</style>
