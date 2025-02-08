import axios from 'axios'
import { useStorageStore } from '@/stores/storage'
const storageStore = useStorageStore()

const http = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
})
// 请求拦截器
const requestInterceptor = (config) => {
    const isUsingCustomApi = storageStore.useCustomApi
    config.baseURL = isUsingCustomApi ? storageStore.customApiUrl : import.meta.env.VITE_BASE_API_URL
    config.timeout = config.timeout || 10000
    return config
}

const errorRequestInterceptor = (error) => {
    return Promise.reject(error)
}

// 响应拦截器
const responseInterceptor = (response) => {
    return response
}

const errorResponseInterceptor = (error) => {
    return Promise.reject(error)
}

http.interceptors.response.use(responseInterceptor, errorResponseInterceptor)
http.interceptors.request.use(requestInterceptor, errorRequestInterceptor)

export default http