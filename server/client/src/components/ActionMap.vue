<template>
  <div class="rete" ref="rete"></div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
/* global chrome */
import { NodeEditor, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
// import {
//   ConnectionPlugin,
//   Presets as ConnectionPresets,
// } from 'rete-connection-plugin'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { ReadonlyPlugin } from 'rete-readonly-plugin'
// import { MinimapPlugin } from 'rete-minimap-plugin'
import * as d3 from 'd3'
import { defineProps, onMounted, computed, onUnmounted } from 'vue'
import Node from '@/components/ActionNode'

// Props
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
  showPath: {
    required: false,
    type: Boolean,
    default: false,
  },
})

// Render Options
const options = {
  dx: 64, // the distance between nodes on the x-axis
  dy: 256 + 64, // the distance between nodes on the y-axis
}

// Variables
let currentAction = computed(() => props.currentAction)
let area = null

// Create the rete graph editor
async function createEditor(container) {
  // Create editor and engine
  const socket = new ClassicPreset.Socket('socket')
  const editor = new NodeEditor()
  const area = new AreaPlugin(container)
  // const connection = new ConnectionPlugin()  // disable changing connections
  const render = new VuePlugin()
  const readonly = new ReadonlyPlugin()
  // const minimap = new MinimapPlugin({
  //   boundViewport: true,
  // })
  const selector = AreaExtensions.selector()
  const accumulating = AreaExtensions.accumulateOnCtrl()
  AreaExtensions.selectableNodes(area, selector, { accumulating })

  // Setup and register plugins
  render.addPreset(
    Presets.classic.setup({
      customize: {
        node(context) {
          return Node
        },
      },
    })
  )

  render.addPreset(Presets.classic.setup())
  // render.addPreset(Presets.minimap.setup({ size: 200 }))
  // connection.addPreset(ConnectionPresets.classic.setup())  // disable changing connections

  editor.use(readonly.root)
  editor.use(area)

  area.use(readonly.area)
  // area.use(connection)  // disable changing connections
  area.use(render)
  // area.use(minimap)

  AreaExtensions.simpleNodesOrder(area)

  let actionMap = props.actionMap

  // Add indpendent actions to the action map if they exist
  if (actionMap.independentActions && actionMap.independentActions.length > 0) {
    function addIndependentActions(node) {
      if (node.children === undefined) {
        node.children = []
      }
      for (let i = 0; i < node.children.length; i++) {
        addIndependentActions(node.children[i])
      }

      node.children = [
        ...actionMap.independentActions.map((action) => {
          let indAction = { ...action }
          indAction.position = node.position + indAction.idx
          return indAction
        }),
        ...node.children,
      ]
    }
    addIndependentActions(actionMap)
  }

  // Use d3's layout algorithm to calculate node positions
  const tree = d3.hierarchy(actionMap)
  d3.tree().nodeSize([options.dx, options.dy])(tree)

  // Calculate the provenance path
  function determineProvenance(node) {
    if (node === null || null === undefined || node.data === undefined) {
      return false
    }

    // if at the current action, then it is part of the path, return up the stack
    if (node.data.position === currentAction.value.position) {
      node.data.isPath = true
      return true
    }

    if (node.data.children === undefined) {
      // node.data.isPath = false
      return false
    }

    for (let i = 0; i < node.data.children.length; i++) {
      const child = node.children[i]
      if (determineProvenance(child)) {
        node.data.isPath = true
        return true
      }
    }
    // node.data.isPath = false
    return false
  }
  if (props.showPath) {
    determineProvenance(tree)
  }

  // Helper function to create rete node
  function createNode(node) {
    const position = node.data.position
    const length = node.data.children.length

    // Create nodes
    const n = new ClassicPreset.Node(`Action ${position}`)
    n.currentAction = currentAction
    // Create sockets
    if (position != 0) {
      n.addInput('port', new ClassicPreset.Input(socket))
    }
    // if (position != length - 1) {
    if (length != 0) {
      n.addOutput('port', new ClassicPreset.Output(socket))
    }

    // Add relevant props
    n.action = node.data
    n.currentAction = currentAction
    n.showPath = props.showPath
    return n
  }

  // iterate through actionmap and create rete graph
  async function dfs(node) {
    // Create the node
    const n = createNode(node)
    await editor.addNode(n)
    await area.translate(n.id, { x: node.y, y: node.x })

    // Iterate through the children and create connections
    for (let i = 0; i < node.data.children.length; i++) {
      const child = node.children[i]
      const childNode = await dfs(child)
      await editor.addConnection(
        new ClassicPreset.Connection(n, 'port', childNode, 'port')
      )
    }
    return n
  }
  await dfs(tree)

  AreaExtensions.zoomAt(area, editor.getNodes())
  readonly.enable()

  area.addPipe((context) => {
    if (context.type === 'nodepicked') {
      const node = editor.getNode(context.data.id)
      props.setCurrentAction(node.action)
    }
    return context
  })

  return area
}

onMounted(() => {
  let container = document.querySelector('.rete')
  createEditor(container).then((a) => {
    area = a
  })
})
onUnmounted(() => {
  area.destroy()
})
</script>

<style scoped>
.rete {
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}
</style>
