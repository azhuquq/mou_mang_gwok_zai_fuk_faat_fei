<template>
    <div class="flex flex-col w-full overflow-x-hidden overflow-y-auto touch-pan-y">
        <Appbar />
        <v-main>
            <v-container fluid class="p-2">
                <router-view v-slot="{ Component }">
                    <component :is="Component" />
                </router-view>
            </v-container>
        </v-main>
        <v-footer absolute app v-if="route.name === 'home' || route.name === 'giveticket'">
            <div class="text-center text-sm text-red-500" @click="handleClick">{{ t('footer.TOS') }}</div>
        </v-footer>
    </div>
</template>
<script setup>
import Appbar from './AppBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const clickCount = ref(0)
let clickTimer = null

const handleClick = () => {
    clickCount.value++
    if (clickTimer) clearTimeout(clickTimer)
    
    clickTimer = setTimeout(() => {
        clickCount.value = 0
    }, 500)
    
    if (clickCount.value >= 10) {
        clickCount.value = 0
        if (clickTimer) clearTimeout(clickTimer)
        router.push({ name: 'debug' })
    }
}
</script>
