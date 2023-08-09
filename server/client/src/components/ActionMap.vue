<template>
  <div class="rete" ref="rete"></div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
/* global chrome */
import { NodeEditor, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { ReadonlyPlugin } from 'rete-readonly-plugin'
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from 'rete-auto-arrange-plugin'
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin'

import {
  defineExpose,
  defineProps,
  onMounted,
  computed,
  onUnmounted,
} from 'vue'

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
let area = null

async function createEditor(container) {
  // Create editor and engine
  const socket = new ClassicPreset.Socket('socket')
  const editor = new NodeEditor()
  const area = new AreaPlugin(container)
  const connection = new ConnectionPlugin()
  const render = new VuePlugin()
  const readonly = new ReadonlyPlugin()
  const arrange = new AutoArrangePlugin()
  const minimap = new MinimapPlugin({
    boundViewport: true,
  })

  // Setup and register plugins
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  })

  arrange.addPreset(ArrangePresets.classic.setup())

  render.addPreset(Presets.classic.setup())
  render.addPreset(Presets.minimap.setup({ size: 200 }))

  connection.addPreset(ConnectionPresets.classic.setup())

  editor.use(readonly.root)
  editor.use(area)

  area.use(arrange)
  area.use(readonly.area)
  area.use(connection)
  area.use(render)
  area.use(minimap)

  AreaExtensions.simpleNodesOrder(area)

  // Create Nodes
  const actionMap = props.actionMap
  async function dfs(node) {
    const n = new ClassicPreset.Node(`Action ${node.position}`)
    if (node.position != 0) {
      n.addInput('port', new ClassicPreset.Input(socket))
    }
    if (node.children.length != 0) {
      n.addOutput('port', new ClassicPreset.Output(socket))
    }

    await editor.addNode(n)

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      const childNode = await dfs(child)
      await editor.addConnection(
        new ClassicPreset.Connection(n, 'port', childNode, 'port')
      )
    }
    return n
  }
  const node = await dfs(actionMap)
  await arrange.layout()

  AreaExtensions.zoomAt(area, editor.getNodes())

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

// TODO: It would be nice to render only as needed without having parents
// make this call, but reactivity is being lost in the properties of the
// Object passed in. Even if reactivity can be properly established, this
// render likely needs to be throttled to avoid many render calls when
// performing an action that affects many nodes.
// defineExpose({ render })
</script>

<style scoped>
.rete {
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}
</style>
