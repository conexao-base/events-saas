import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRedirecting = false

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''

    // Credenciais inválidas não devem encerrar uma sessão existente.
    const isLoginRequest = /\/(auth\/)?sign-in\/?$|\/auth\/login\/?$/.test(url)

    if (status === 401 && !isLoginRequest && !isRedirecting) {
      isRedirecting = true

      useAuthStore.getState().auth.reset()

      if (window.location.pathname !== '/sign-in') {
        window.location.assign('/sign-in')
      } else {
        isRedirecting = false
      }
    }

    return Promise.reject(error)
  }
)
