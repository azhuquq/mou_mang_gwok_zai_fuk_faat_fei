<template>
    <div class="flex flex-col items-center justify-center w-full gap-4">
        <!-- 第一次启动 -->
        <div v-if="!launched && stateStore.lastReadSerial" class="w-full">
            <v-card @click="getTicket" class="w-full" variant="outlined" color="primary">
                <v-card-text class="flex flex-row items-center justify-center gap-2">
                    <v-icon>mdi:ticket-outline</v-icon>
                    <div>{{ t('giveTicket.getTicketFirst') }}</div>
                </v-card-text>
            </v-card>
        </div>
        <!-- 启动过 -->
        <div v-if="isLoading" class="mt-20 flex flex-col items-center justify-center">
            <v-progress-circular indeterminate color="primary" size="x-large" />
        </div>
        <!-- 加载完成 -->
        <div v-if="stateStore.lastReadSerial && !isLoading && launched"
            class="flex flex-col items-center justify-center w-full gap-4">
            <v-card class="w-full" :title="t('giveTicket.lastRequestTitle')">
                <v-card-text>
                    <div>{{ getErrorMessage(errorCode) }}</div>
                </v-card-text>
            </v-card>
            <v-card @click="getTicket" class="w-full" variant="outlined" color="primary">
                <v-card-text class="flex flex-row items-center justify-center gap-2">
                    <v-icon>{{ isLoadingError ? 'mdi:refresh' : 'mdi:ticket-outline' }}</v-icon>
                    <div>{{ isLoadingError ? t('common.retry') : t('giveTicket.refreshTicket') }}</div>
                </v-card-text>
            </v-card>
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
import { ticket } from '@/api'

const stateStore = useStateStore()
const storageStore = useStorageStore()
const { t } = useI18n()
const router = useRouter()

const idm = ref('')

const launched = ref(false)
const isLoading = ref(false)
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
    }
})

const getTicket = () => {
    launched.value = true
    isLoading.value = true
    isLoadingError.value = false
    ticket({ idm: idm.value }).then(res => {
        isLoading.value = false
        if (res.data.code === 200) {
            errorCode.value = 200
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

</script>