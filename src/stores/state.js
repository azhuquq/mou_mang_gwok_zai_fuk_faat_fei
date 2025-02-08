import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', {
    state: () => ({
        lastReadSerial: null,
        readAccessCodeMode: false
    })
})