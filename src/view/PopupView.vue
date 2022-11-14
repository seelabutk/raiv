<template>
  <div class="main_app">
    <h1>Hello {{ store.recording }}</h1>

    <button @click="recordPause">Start recording</button>
  </div>
</template>

<script setup>
import _store from '@/entry/background'

const store =
  localStorage.getItem('store') === null ? _store.create() : _store.read()

function recordPause() {
  _store.update('recording', true)
}
</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
