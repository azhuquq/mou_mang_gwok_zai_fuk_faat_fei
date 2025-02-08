<template>
    <div class="flex flex-col items-center justify-center w-full gap-4">
        <v-card class="w-full" title="Step 1">
            <v-card-text>
                <div>{{ t('getsnguide.step1') }}</div>
            </v-card-text>
            <template v-slot:actions>
                <div class="ml-auto flex flex-row">
                    <v-btn @click="handleOpenAppStore" icon="mdi:apple" variant="text" color="blue" />
                    <v-btn @click="handleOpenGooglePlay" icon="mdi:google-play" variant="text" color="teal" />
                </div>
            </template>
        </v-card>
        <v-card class="w-full" title="Step 2">
            <v-card-text>
                <div>{{ t('getsnguide.step2') }}</div>
            </v-card-text>
        </v-card>
        <v-card class="w-full" title="Step 3">
            <v-card-text>
                <div>{{ t('getsnguide.step3') }}</div>
            </v-card-text>
            <template v-slot:actions>
                <div class="ml-auto">
                    <v-btn @click="router.push('/')" variant="text" color="primary">{{t('getsnguide.finish')}}</v-btn>
                </div>
            </template>
        </v-card>
    </div>

</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const router = useRouter()


const handleOpenAppStore = () => {
    window.open('https://apps.apple.com/us/app/nfc-tools/id1252962749', '_blank')
}
const handleOpenGooglePlay = () => {
    window.open('https://play.google.com/store/apps/details?id=com.wakdev.wdnfc', '_blank')
}
</script>
