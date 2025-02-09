<template>
    <div v-if="isLoading" class="mt-20 flex flex-col items-center justify-center">
        <v-progress-circular indeterminate color="primary" size="x-large" />
    </div>
    <div v-else class="w-full">
        <div v-if="accessCode && isLoaded" class="flex flex-col items-center justify-center gap-4">
            <div class="flex flex-col items-center justify-center gap-4">
                <div>{{ t('accessCode.yourAccessCodeText') }}</div>
                <div>
                    <div class="flex flex-row items-center">
                        <div class="text-lg">{{ privacyAccessCode(accessCode) }}</div>
                        <v-btn variant="text" icon="mdi:content-copy" @click="handleCopy(accessCode)" />
                    </div>
                </div>
            </div>
            <div class="w-full flex flex-col gap-4">
                <v-divider>
                    <div class="text-sm text-gray-500 w-full">{{ t('accessCode.shortcut') }}</div>
                </v-divider>
                <v-card @click="handleOpenMyAime">
                    <div class="flex items-center">
                        <v-card-text class="flex items-center gap-2">
                            <v-icon>mdi:open-in-new</v-icon>
                            <div class="text-lg">Aimeサービスサイト</div>
                        </v-card-text>
                    </div>
                </v-card>
                <v-card @click="handleOpenMaimaiNet">
                    <div class="flex items-center">
                        <v-card-text class="flex items-center gap-2">
                            <v-icon>mdi:open-in-new</v-icon>
                            <div class="text-lg">maimai DX NET</div>
                        </v-card-text>
                    </div>
                </v-card>
            </div>
            <div v-if="storageStore.privacyMode">
                <div class="text-sm text-gray-500 w-full">{{ t('accessCode.privacyModeTip') }}</div>
            </div>
        </div>
        <div v-if="errorCode || isLoadingError" class="flex flex-col items-center justify-center gap-4">
            <div v-if="errorCode"> {{ getErrorMessage(errorCode) }} </div>
            <v-btn @click="getAccessCode" v-if="isLoadingError" color="primary" variant="outlined">{{
                t('common.retry') }}</v-btn>
        </div>
    </div>
    <v-snackbar v-model="snackbar.active" :timeout="3000">{{ snackbar.text }}</v-snackbar>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/stores/state'
import { useStorageStore } from '@/stores/storage'
import useNFC from '@/utils/useNFC'
const { startReading, stopReading, hasNFC, latestRead, checkNFCPermission, requestNFCPermission } = useNFC()
import { felica } from '@/api'

const stateStore = useStateStore()
const storageStore = useStorageStore()
const { t } = useI18n()
const router = useRouter()

const idm = ref('')

const accessCode = ref('')
const isLoading = ref(false)
const isLoaded = ref(false)
const isLoadingError = ref(false)
const errorCode = ref(null)

const snackbar = ref({
    active: false,
    text: ''
})

onMounted(() => {
    stopReading()
    if (!stateStore.lastReadSerial) {
        router.push({ name: 'home' })
    } else {
        idm.value = stateStore.lastReadSerial
        getAccessCode()
    }
})

const getAccessCode = () => {
    isLoading.value = true
    isLoadingError.value = false
    felica({ idm: idm.value }).then(res => {
        isLoading.value = false
        if (res.data.code === 200) {
            accessCode.value = res.data.data
            errorCode.value = null
            isLoaded.value = true
        } else {
            errorCode.value = res.data.code
        }
    }).catch(err => {
        console.log("🚩 ~ felica ~ err 👇\n", err)
        isLoading.value = false
        isLoadingError.value = true
        if (err.response) {
            console.log("🚩 ~ felica ~ err.response 👇\n", err.response)
            errorCode.value = err.response.status
        }
    })
}

const getErrorMessage = (code) => {
    if (!code) {
        return t('errorCode.default')
    }
    const message = t(`errorCode.${code}`)
    return message && message !== `errorCode.${code}`
        ? message
        : t('errorCode.default')
}

const handleOpenMyAime = () => {
    window.open('https://my-aime.net/aime/i/registq.html?ac=' + accessCode.value)
}

const handleOpenMaimaiNet = () => {
    window.open('https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile/&back_url=https://maimai.sega.com/')
}

const handleCopy = (text) => {
    if (text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                snackbar.value.active = true
                snackbar.value.text = t('toast.copySuccess')
                console.log('Text copied to clipboard:', text)
            })
            .catch(err => {
                console.error('Failed to copy text:', err)
            })
    }
}

const privacyAccessCode = (accessCode) => {
    if (!accessCode || accessCode === '') return ''
    if (storageStore.privacyMode) {
        return accessCode.slice(0, 4) + '****' + accessCode.slice(-4)
    } else {
        return accessCode
    }
}
</script>
