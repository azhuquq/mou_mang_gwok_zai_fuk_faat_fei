<template>
    <div class="flex flex-col gap-4 w-full">
        <v-card title="Use eruda">
            <v-card-text class="flex flex-row align-center justify-between">
                <div class="flex-1">Use eruda</div>
                <v-switch color="primary" v-model="storageStore.useEruda" hide-details inline
                    density="compact"></v-switch>
            </v-card-text>
        </v-card>
        <v-card title="Use custom api">
            <v-card-text class="flex flex-col gap-2">
                <div class="flex flex-row align-center justify-between">
                    <div class="flex-1">Use your own API</div>
                    <v-switch color="primary" v-model="storageStore.useCustomApi" hide-details inline
                        density="compact"></v-switch>
                </div>
                <div>
                    <v-text-field v-if="storageStore.useCustomApi" v-model="storageStore.customApiUrl"
                        label="Custom api url" placeholder="https://your-api-url.com"></v-text-field>
                </div>
            </v-card-text>
        </v-card>
        <v-btn color="error" @click="clearStorage" variant="outlined">Clear Storage</v-btn>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { useStorageStore } from '@/stores/storage'
import { useRouter } from 'vue-router'
const storageStore = useStorageStore()
const router = useRouter()

const clearStorage = () => {
    localStorage.clear()
    storageStore.$reset()
    router.push({ name: 'home' })
}
</script>