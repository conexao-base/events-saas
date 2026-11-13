import axios from 'axios'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth-store'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { auth } = useAuthStore.getState()

    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in-2',
        search: { redirect: location.href },
        replace: true,
      })
    }

    try {
      const user = await authService.me()

      auth.setUser({
        accountNo: String(user.id),
        email: user.email,
        role: user.role ?? [],
        exp: user.exp ?? 0,
      })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        auth.reset()

        window.location.replace('/sign-in-2')
        return
      }

      throw error
    }
  },

  component: AuthenticatedLayout,
})
