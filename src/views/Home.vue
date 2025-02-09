<template>
  <main>
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="mt-20 flex flex-col items-center justify-center gap-4">
        <!-- 有 NFC 且有权限 -->
        <div v-if="hasNFC() && nfcPermission === 'granted'"
          class="flex flex-col items-center justify-center text-center gap-4">
          <v-icon size="128" class="mt-12">mdi:credit-card-scan-outline</v-icon>
          <div class="text-2xl">{{ t('home.promptReadCard') }} </div>
          <v-btn variant="outlined" :color="stateStore.readAccessCodeMode ? 'primary' : 'default'"
            @click="stateStore.readAccessCodeMode = !stateStore.readAccessCodeMode">
            {{ t('home.readAccessCodeMode') }}
            <template v-slot:append v-if="stateStore.readAccessCodeMode">
              <v-icon>mdi:check</v-icon>
            </template>
          </v-btn>
        </div>
        <!-- 浏览器不支持 NFC -->
        <div v-if="!hasNFC()" class="text-center">
          {{ t('home.noNFCInfo') }}
        </div>
        <!-- 已拒绝 NFC 权限 -->
        <div v-if="hasNFC() && nfcPermission === 'denied'"
          class="flex flex-col items-center justify-center text-center gap-4">
          <div>{{ t('home.nfcPermissionDenied') }}</div>
          <v-btn @click="handleRequestPermission" variant="outlined">
            {{ t('home.retryRequestPermission') }}
          </v-btn>
        </div>
        <!-- 未请求 NFC 权限 -->
        <div v-if="hasNFC() && nfcPermission === 'prompt'"
          class="flex flex-col items-center justify-center text-center gap-4">
          <v-btn @click="handleRequestPermission" color="primary" variant="outlined">
            {{ t('home.requestNFCPermission') }}
          </v-btn>
        </div>
        <!-- 其他内容 -->
        <v-btn variant="plain" size="small" @click="handleOpenManualInputDialog">{{ t('home.manualInputMode') }}</v-btn>
        <v-switch hide-details inset v-model="storageStore.privacyMode" color="primary"
          :label="t('setting.privacyMode')" />
      </div>
    </div>
    <v-snackbar v-model="snackbar.active" :timeout="3000">{{ snackbar.text }}</v-snackbar>
    <v-dialog v-model="manualDialog.active">
      <v-card :title="t('home.manualInputTitle')">
        <template v-slot:subtitle>
          <div> {{ t('home.manualInputSubtitle') }} </div>
          <div class="text-primary underline" @click="router.push({ name: 'getsnguide' })">{{
            t('home.manualInputGuideLinkText') }}</div>
        </template>
        <template v-slot:text>
          <v-text-field v-model="manualDialog.text" :label="t('home.manualInputPlaceholder')" hide-details
            :type="storageStore.privacyMode ? 'password' : 'text'" clearable persistent-clear
            @click:clear="onManualInputClear" />
        </template>
        <template v-slot:actions>
          <v-btn :text="t('home.manualInputNext')" @click="handleManualInputNext" color="primary"
            :disabled="!judgeIfValidAmusementICCard(manualDialog.text)"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </main>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, watch, onUnmounted } from "vue"
import formatCardSerial from '@/utils/formatCardSerial'
import useNFC from "@/utils/useNFC"
import { useStorageStore } from '@/stores/storage'
import { useRouter } from 'vue-router'
import { useStateStore } from '@/stores/state'
const router = useRouter()
const storageStore = useStorageStore()
const stateStore = useStateStore()
const { t } = useI18n()
// 获取 NFC 相关方法
const { startReading, stopReading, hasNFC, latestRead, checkNFCPermission, requestNFCPermission } = useNFC()

const serial = ref('')
const nfcPermission = ref('prompt')
const snackbar = ref({
  active: false,
  text: ''
})
const intervals = ref(null)
const manualDialog = ref({
  active: false,
  text: ''
})

const latestNFCSerial = computed(() => {
  return latestRead.value ? latestRead.value.serialNumber : "N/A"
})

// 监听 NFC 读取数据的变化
watch(latestNFCSerial, async (newVal) => {
  console.log('latestNFCSerial', latestRead.value)
  if (newVal && newVal !== 'N/A') {
    serial.value = formatCardSerial(newVal)
    if (!judgeIfValidAmusementICCard(serial.value)) {
      snackbar.value.active = true
      snackbar.value.text = t('toast.invalidCard')
    } else if (stateStore.readAccessCodeMode) {
      stateStore.lastReadSerial = formatCardSerial(newVal)
      router.push({ name: 'accesscode' })
    } else {
      stateStore.lastReadSerial = formatCardSerial(newVal)
      router.push({ name: 'giveticket' })
    }
    latestRead.value = undefined
    if (intervals.value) {
      clearInterval(intervals.value)
    }
    intervals.value = setInterval(() => {
      startReading()
    }, 500)
  }
})


const judgeIfValidAmusementICCard = (serial) => {
  const formatSerial = formatCardSerial(serial)
  return formatSerial.length === 16
}

// 检查 NFC 权限
const checkPermission = async () => {
  nfcPermission.value = await checkNFCPermission()
}

// 组件挂载时检查权限
onMounted(async () => {
  await checkPermission()
  latestRead.value = undefined
  stateStore.lastReadSerial = null
  if (hasNFC() && nfcPermission.value === 'granted') {
    startReading()
  }
})

onUnmounted(() => {
  if (intervals.value) {
    clearInterval(intervals.value)
  }
  stopReading()
})

const handleRequestPermission = async () => {
  try {
    const result = await requestNFCPermission()
    nfcPermission.value = result
    if (result === 'granted') {
      startReading()
    }
  } catch (err) {
    console.error('请求 NFC 权限失败:', err)
  }
}

const handleOpenManualInputDialog = () => {
  manualDialog.value.active = true
  if (!manualDialog.value.text) {
    manualDialog.value.text = storageStore.manualInputSerial || ''
  }
}

const handleManualInputNext = () => {
  if (judgeIfValidAmusementICCard(manualDialog.value.text)) {
    const formatSerial = formatCardSerial(manualDialog.value.text)
    if (judgeIfValidAmusementICCard(formatSerial)) {
      stateStore.lastReadSerial = formatSerial
      storageStore.manualInputSerial = formatSerial
      router.push({ name: 'giveticket' })
    } else {
      snackbar.value.active = true
      snackbar.value.text = t('toast.invalidSerial')
    }
  }
}

const onManualInputClear = () => {
  manualDialog.value.text = ''
  storageStore.manualInputSerial = null
}
</script>
