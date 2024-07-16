<template>
  <v-card min-width="300" max-width="300" class="ma-4" variant="tonal" @click="openGroupVideoList()">
    <v-card-text class="d-flex align-center"> 
      <v-icon size="x-large" class="mr-2">mdi-folder-account</v-icon> 
      <v-card-title class="text-black" style="flex: auto">{{ props.name }}</v-card-title>
      <v-card-subtitle v-if="props.videoList.length === 1">{{ props.videoList.length }} capture</v-card-subtitle>
      <v-card-subtitle v-else>{{ props.videoList.length }} captures</v-card-subtitle>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'

const emit = defineEmits(['show'])
const props = defineProps({
  name: {
    required: true,
    type: String,
  },
  videoList: {
    required: true,
    type: Object,
  }
})
const chosenGroupVideoList = ref([])

function openGroupVideoList(){
  chosenGroupVideoList.value = props.videoList
  emit('show', chosenGroupVideoList)
}

</script>