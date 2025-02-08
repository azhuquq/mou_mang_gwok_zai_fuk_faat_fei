import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n, useI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import messages from './locales/messages'

// Vuetify
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { zhHant, en } from 'vuetify/locale'

import './main.css'
import { Icon } from '@iconify/vue'

import App from './App.vue'
import router from './router'
import { useStorageStore } from './stores/storage'

// 获取浏览器语言
const getBrowserLanguage = () => {
    // 首先检查本地存储
    const savedLanguage = localStorage.getItem('user-lang')
    if (savedLanguage) return savedLanguage

    const language = navigator.language || navigator.userLanguage
    if (language.toLowerCase().startsWith('zh')) {
        return language === 'zh-TW' ? 'zh-TW' : 'zh-HK'
    }
    return 'zh-HK'
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)  // 首先初始化 pinia

const storageStore = useStorageStore()

const i18n = createI18n({
    legacy: false,
    locale: storageStore.language,
    fallbackLocale: 'zh-HK',
    messages: {
        ...messages,
        'en': { $vuetify: { ...en }, ...messages['en'] },
        'zh-HK': { $vuetify: { ...zhHant }, ...messages['zh-HK'] },
        'zh-TW': { $vuetify: { ...zhHant }, ...messages['zh-TW'] },
    },
})

const vuetify = createVuetify({
    components,
    directives,
    locale: {
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
    icons: {
        defaultSet: 'custom',
        sets: {
            custom: {
                component: Icon,
            },
        },
    },
})

app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
