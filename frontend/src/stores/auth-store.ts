import { create } from 'zustand'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const ACCESS_TOKEN =
  import.meta.env.VITE_ACCESS_TOKEN_COOKIE || 'conexao_access_token'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

function getInitialToken(): string {
  const token = getCookie(ACCESS_TOKEN)

  if (!token || token === 'undefined' || token === 'null') {
    return ''
  }

  try {
    const parsed: unknown = JSON.parse(token)
    return typeof parsed === 'string' ? parsed : token
  } catch {
    return token
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    user: null,

    setUser: (user) =>
      set((state) => ({
        auth: { ...state.auth, user },
      })),

    accessToken: getInitialToken(),

    setAccessToken: (accessToken) =>
      set((state) => {
        setCookie(ACCESS_TOKEN, accessToken)

        return {
          auth: { ...state.auth, accessToken },
        }
      }),

    resetAccessToken: () =>
      set((state) => {
        removeCookie(ACCESS_TOKEN)

        return {
          auth: { ...state.auth, accessToken: '' },
        }
      }),

    reset: () => {
      removeCookie(ACCESS_TOKEN)

      set((state) => ({
        auth: {
          ...state.auth,
          user: null,
          accessToken: '',
        },
      }))
    },
  },
}))
