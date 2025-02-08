import http from './axios'

export const ticket = (data) => http.post('/ticket', data)

export const felica = (data) => http.post('/felica', data)
