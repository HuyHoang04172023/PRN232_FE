import axios from 'axios'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBaseUrl as string,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (process.client) {
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  return {
    provide: {
      api,
    },
  }
})
