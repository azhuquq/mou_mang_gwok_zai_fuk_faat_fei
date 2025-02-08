import { defineStore } from 'pinia'

const STORAGE_KEY = 'sdga_ticket_giver'

// 获取浏览器语言
const getBrowserLanguage = () => {
  const language = navigator.language || navigator.userLanguage
  if (language.toLowerCase().startsWith('zh')) {
    return language === 'zh-TW' ? 'zh-TW' : 'zh-HK'
  } else if (language.toLowerCase().startsWith('en')) {
    return 'en'
  } else {
    return 'zh-HK'
  }
}

const defaultState = {
  language: getBrowserLanguage(),
  privacyMode: true,
  manualInputSerial: null,
  useEruda: false,
  useCustomApi: false,
  customApiUrl: ''
}

const getInitialStorage = () => {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (!savedState) {
    return defaultState
  }

  const parsedState = JSON.parse(savedState)
  const updatedState = { ...defaultState }

  Object.keys(defaultState).forEach(key => {
    if (key in parsedState) {
      updatedState[key] = parsedState[key]
    }
  })

  return updatedState
}

export const useStorageStore = defineStore('sdgaApiCallerStorage', {
  state: () => ({
    ...getInitialStorage()
  }),
  actions: {
    initStorage() {
      this.$subscribe((_, state) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      })
    }
  }
})