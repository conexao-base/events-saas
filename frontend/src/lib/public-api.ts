import axios from 'axios'

export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

publicApi.interceptors.request.use((config) => {
  config.skipAuthHandling = true

  return config
})
