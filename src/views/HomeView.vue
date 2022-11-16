<template>
  <HomeComponent :worker="worker" />
</template>

<script setup>
import ServiceWorker from '@/entry/background'
import HomeComponent from '@/components/HomeComponent'

const worker = new ServiceWorker()
</script>
