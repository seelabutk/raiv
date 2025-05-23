<template>
  <div
    class="node"
    :class="{ selected: selected, 'is-path': isPath }"
    :style="nodeStyles"
    data-testid="node"
  >
    <div class="top-section">
      <!-- Inputs-->
      <div
        class="input"
        v-for="[key, input] in inputs"
        :key="key + seed"
        :data-testid="'input-' + key"
      >
        <Ref
          class="input-socket"
          :emit="emit"
          :data="{
            type: 'socket',
            side: 'input',
            key: key,
            nodeId: data.id,
            payload: input.socket,
          }"
          data-testid="input-socket"
        />
        <div
          class="input-title"
          v-show="!input.control || !input.showControl"
          data-testid="input-title"
        >
          {{ input.label }}
        </div>
        <Ref
          class="input-control"
          v-show="input.control && input.showControl"
          :emit="emit"
          :data="{ type: 'control', payload: input.control }"
          data-testid="input-control"
        />
      </div>
      <!-- Title -->
      <div class="title" data-testid="title">{{ "Action " + data.action.ID }}</div>
      <!-- Outputs-->
      <div
        class="output"
        v-for="[key, output] in outputs"
        :key="key + seed"
        :data-testid="'output-' + key"
      >
        <div class="output-title" data-testid="output-title">
          {{ output.label }}
        </div>
        <Ref
          class="output-socket"
          :emit="emit"
          :data="{
            type: 'socket',
            side: 'output',
            key: key,
            nodeId: data.id,
            payload: output.socket,
          }"
          data-testid="output-socket"
        />
      </div>
    </div>
    <!-- Controls-->
    <Ref
      class="control"
      v-for="[key, control] in controls"
      :key="key + seed"
      :emit="emit"
      :data="{ type: 'control', payload: control }"
      :data-testid="'control-' + key"
    />
  </div>
</template>

<script lang="js">
import { defineComponent, watch, ref } from 'vue'
import { Ref } from 'rete-vue-plugin'
function sortByIndex(entries) {
  entries.sort((a, b) => {
    const ai = a[1] && a[1].index || 0
    const bi = b[1] && b[1].index || 0

    return ai - bi
  })
  return entries
}

export default defineComponent(
  {
  props: ['data', 'emit', 'seed'],
  setup: (props) => {
    const data = props.data || {}
    const action = data.action || {}

    // Change styles depending on if the node is selected
    let selected = ref(props.data.currentAction.value === action)
    watch(props.data.currentAction, (newVal) => {
      selected.value = newVal === action
    })
    let isPath = ref(action.isPath)
    return {
      action,
      selected,
      isPath
    }
  },
  methods: {
    onRef(element, key, entity, type) {
      if (!element) return

      if (['output', 'input'].includes(type)) {
        this.emit({
          type: 'render', data: {
            type: 'socket',
            side: type,
            key,
            nodeId: this.data.id,
            element,
            payload: entity.socket
          }
        })
      } else if (type === 'control') {
        this.emit({
          type: 'render', data: {
            type: 'control',
            element,
            payload: entity
          }
        })
      }
    },
    onSelect() {
      this.data.setCurrentAction(this.action)
    }
  },
  computed: {
    nodeStyles() {
      return {
        width: Number.isFinite(this.data.width) ? `${this.data.width}px` : '',
        height: Number.isFinite(this.data.height) ? `${this.data.height}px` : ''
      }
    },
    inputs() {
      return sortByIndex(Object.entries(this.data.inputs))
    },
    controls() {
      return sortByIndex(Object.entries(this.data.controls))
    },
    outputs() {
      return sortByIndex(Object.entries(this.data.outputs))
    },
  },
  components: {
    Ref
  }
})
</script>

<style lang="scss" scoped>
@use 'sass:math';
@import './vars';

.node {
  background: #E1F5FE;
  border: 2px solid #81D4FA;
  border-radius: 10px;
  cursor: pointer;
  box-sizing: border-box;
  width: $node-width;
  height: auto;
  padding-top: 6px;
  position: relative;
  user-select: none;

  .top-section {
    display: flex;
    flex-direction: row;
    padding: 0;
  }
  &:hover {
    background: #81D4FA;
  }

  &.selected {
    background: #ffe46e !important;
    border-color: #e3c000;
  }

  .title {
    color: black;
    font-family: sans-serif;
    font-size: 18px;
    font-weight: bolder;
    padding: 8px;
  }

  &.is-path {
    border: 2px solid #EF9A9A;
    background: #FFCDD2;
  }

  .output {
    text-align: right;
    margin-left: auto;
  }

  .input {
    text-align: left;
  }

  .output-socket {
    text-align: right;
    margin-right: -15px;
    display: inline-block;
  }

  .input-socket {
    text-align: left;
    margin-left: -15px;
    display: inline-block;
  }

  .input-title,
  .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    margin: $socket-margin;
    line-height: $socket-size;
  }

  .input-control {
    z-index: 1;
    width: calc(100% - #{$socket-size + 2 * $socket-margin});
    vertical-align: middle;
    display: inline-block;
  }

  .control {
    padding: $socket-margin math.div($socket-size, 2) + $socket-margin;
  }
}
</style>
