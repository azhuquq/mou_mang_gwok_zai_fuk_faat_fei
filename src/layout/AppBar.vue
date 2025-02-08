<template>
    <v-app-bar :elevation="2">
        <template v-slot:prepend>
            <v-btn icon="mdi:arrow-left" @click="router.push({ name: 'home' })" v-if="route.name !== 'home'" />
        </template>
        <template v-slot:append v-if="route.name === 'home'">
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi:translate" v-bind="props" />
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in languages" :key="index" :value="index"
                        @click="changeLanguage(item.value)">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
        <v-app-bar-title>{{ t(title) }}</v-app-bar-title>
    </v-app-bar>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStorageStore } from '@/stores/storage'

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()
const storageStore = useStorageStore()

const languages = [
    { title: '港/澳繁體', value: 'zh-HK' },
    { title: 'English', value: 'en' },
    { title: '正體中文', value: 'zh-TW' },
]

const changeLanguage = (lang) => {
    locale.value = lang
    storageStore.language = lang
    document.querySelector('html').setAttribute('lang', lang)
}

const title = computed(() => {
    return "route." + route.meta.title
})
</script>
