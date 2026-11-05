import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { signUpSchema, type SignUpFormValues } from './sign-up.schema'

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)

  const setAccessToken = useAuthStore((state) => state.auth.setAccessToken)
  const setUser = useAuthStore((state) => state.auth.setUser)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true)

    try {
      const response = await authService.signUp({
        email: data.email,
        password: data.password,
      })

      setAccessToken(response.accessToken)

      if (response.user) {
        setUser({
          accountNo: String(response.user.id),
          email: response.user.email,
          role: response.user.role ?? [],
          exp: response.user.exp ?? 0,
        })
      }

      toast.success('Conta criada com sucesso!')

      window.location.assign('/')
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined

      toast.error(
        message || 'Não foi possível criar sua conta. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
