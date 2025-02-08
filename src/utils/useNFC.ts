import { ref, computed, type ComputedRef, type Ref } from "vue"
import { _NDEFReader as NDEFReader } from "./NDEFReader"

export enum NFCStatus {
  IDLE,
  READING,
  WRITING,
  NOT_SUPPORTED,
}

export enum NFCPermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt'
}

export interface NFCInterface {
  ndef: NDEFReader
  status: ComputedRef<NFCStatus>
  is: (nfcStatus: NFCStatus) => boolean
  hasNFC: () => boolean
  startReading: (timeout?: number) => Promise<any>
  stopReading: () => void
  write: (date: any, timeout?: number) => Promise<unknown>
  abortWrite: () => void
  latestRead: Ref<NDEFReadingEvent | undefined>
  latestWrite: Ref<any>
  error: Ref<string | null>
  closeNFC: () => void
  checkNFCPermission: () => Promise<NFCPermissionStatus>
  requestNFCPermission: () => Promise<NFCPermissionStatus>
}

const error = ref<string | null>(null)
const _status = ref<Array<NFCStatus | null>>(new Array(4))

/**
 * 返回最高优先级的状态
 * NOT_SUPPORTED > WRITING > READING > IDLE
 */
const status = computed<NFCStatus>(() => {
  return (
    _status.value.reduce((prev, curr) => {
      prev = prev ? prev : NFCStatus.IDLE
      curr = curr ? curr : NFCStatus.IDLE
      return prev > curr ? prev : curr
    }, NFCStatus.IDLE) || NFCStatus.IDLE
  )
})

const _setStatus = (nfcStatus: NFCStatus, value: boolean) => {
  _status.value[nfcStatus] = value ? nfcStatus : null
}

_setStatus(NFCStatus.IDLE, true)

if (!("NDEFReader" in window)) {
  error.value = "NFC not supported"
  _setStatus(NFCStatus.NOT_SUPPORTED, true)
}

const is = (nfcStatus: NFCStatus) => (_status.value[nfcStatus] ? true : false)

const ndef = new NDEFReader()
let _ignoreRead = false

let _readAbort = new AbortController()
let _readTimeout: number
const latestRead = ref<NDEFReadingEvent>()

let _writeAbort = new AbortController()
let _writeTimeout: number
const latestWrite = ref()

ndef.addEventListener("reading", (ev) => {
  if (!_ignoreRead) {
    latestRead.value = ev as NDEFReadingEvent
  }
})

const startReading = (timeout?: number) => {
  if (_status.value[NFCStatus.READING] === NFCStatus.READING) {
    stopReading()
  }
  _readAbort = new AbortController()
  _setStatus(NFCStatus.READING, true)
  if (timeout) {
    _readTimeout = window.setTimeout(stopReading, timeout)
  }

  return ndef
    .scan({ signal: _readAbort.signal })
    .catch((err) => (error.value = err))
}

const stopReading = () => {
  _readAbort.abort()
  clearTimeout(_readTimeout)
  _setStatus(NFCStatus.READING, false)
}

const write = (data: any, timeout?: number): Promise<unknown> => {
  if (_status.value[NFCStatus.WRITING] === NFCStatus.WRITING) {
    abortWrite()
  }

  _writeAbort = new AbortController()
  _setStatus(NFCStatus.WRITING, true)
  _ignoreRead = true

  if (timeout) {
    _writeTimeout = window.setTimeout(abortWrite, timeout)
  }

  return new Promise<void>((resolve, reject) => {
    _writeAbort.signal.onabort = reject
    ndef
      .write(data, { signal: _writeAbort.signal })
      .then(() => {
        latestWrite.value = data
        resolve(undefined)
      }, reject)
      .finally(() => {
        clearTimeout(_writeTimeout)
        _ignoreRead = false
        _setStatus(NFCStatus.WRITING, false)
      })
  })
}

const abortWrite = () => {
  _writeAbort.abort()
  clearTimeout(_writeTimeout)
  _ignoreRead = false
  _setStatus(NFCStatus.WRITING, false)
}

const closeNFC = () => {
  stopReading()
  abortWrite()
}

const hasNFC = () => {
  return "NDEFReader" in window
}

const checkNFCPermission = async (): Promise<NFCPermissionStatus> => {
  if (!hasNFC()) return NFCPermissionStatus.DENIED
  
  try {
    const permission = await navigator.permissions.query({ name: 'nfc' as PermissionName })
    return permission.state as NFCPermissionStatus
  } catch (err) {
    console.error('检查 NFC 权限失败:', err)
    return NFCPermissionStatus.DENIED
  }
}

const requestNFCPermission = async (): Promise<NFCPermissionStatus> => {
  if (!hasNFC()) return NFCPermissionStatus.DENIED
  
  try {
    // 通过尝试启动 NFC 扫描来触发权限请求
    await ndef.scan()
    // 如果成功启动扫描，说明已获得权限
    return NFCPermissionStatus.GRANTED
  } catch (err) {
    // 如果用户拒绝了权限请求
    return NFCPermissionStatus.DENIED
  }
}

export const useNFC = (): NFCInterface => ({
  ndef,
  status,
  is,
  hasNFC,
  startReading,
  stopReading,
  write,
  abortWrite,
  latestRead,
  latestWrite,
  closeNFC,
  error,
  checkNFCPermission,
  requestNFCPermission
})

export default useNFC