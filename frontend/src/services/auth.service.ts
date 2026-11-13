import { isAxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api'

export interface SignInData {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
}

export interface AuthUserResponse {
  id: string | number
  email: string
  role?: string[]
  exp?: number
}

export interface AuthResponse {
  accessToken: string
  user?: AuthUserResponse
}

export interface AuthMeResponse {
  user: AuthUserResponse
}

export const authService = {
  async signIn(data: SignInData) {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  async signUp(data: SignUpData) {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  async me() {
    try {
      const response = await api.get<AuthMeResponse>('/auth/me')
      return response.data.user
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().auth.reset()

        window.location.replace('/auth/login')
      }

      throw error
    }
  },
}
