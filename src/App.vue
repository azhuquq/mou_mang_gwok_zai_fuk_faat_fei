<template>
  <v-app>
    <RouterView />
  </v-app>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useStorageStore } from '@/stores/storage'
import { useStateStore } from '@/stores/state'

const StorageStore = useStorageStore()
StorageStore.initStorage()
const StateStore = useStateStore()

if (StorageStore.useEruda) {
  const script = document.createElement('script')
  script.src = '//cdn.jsdelivr.net/npm/eruda'
  script.onload = () => eruda.init()
  document.body.appendChild(script)
}

</script>

<style scoped></style>
