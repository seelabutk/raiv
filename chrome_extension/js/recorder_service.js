/* global chrome */
import { defineStore } from 'pinia'

chrome.runtime.onInstalled.addListener(() => {
  const recorderStore = defineStore('recorder', {
    state: () => ({
      paused: false,
      recording: false,
    }),
  })

  window.recorderStore = recorderStore
})
