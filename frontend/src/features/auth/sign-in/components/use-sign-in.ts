import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { signInSchema, type SignInFormValues } from './sign-in.schema'

interface UseSignInOptions {
  redirectTo?: string
}

export function useSignIn({ redirectTo = '/' }: UseSignInOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true)

    try {
      const { accessToken } = await authService.signIn({
        email: data.email,
        password: data.password,
      })

      auth.setAccessToken(accessToken)

      toast.success('Login realizado com sucesso!')

      await navigate({
        to: redirectTo,
        replace: true,
      })
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ??
          'Não foi possível entrar. Verifique suas credenciais.')
        : 'Ocorreu um erro inesperado. Tente novamente.'

      toast.error(message)
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
