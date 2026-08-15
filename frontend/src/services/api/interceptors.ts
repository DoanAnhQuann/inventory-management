import type { AxiosError } from 'axios'

import { apiClient } from './client'

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
)
