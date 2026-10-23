import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === '' ? 'Por favor insira seu e-mail.' : undefined,
  }),
  password: z
    .string()
    .min(1, 'Por favor insira sua senha.')
    .min(8, 'A senha deve ter pelo menos 8 caracteres.'),
})

export type SignInFormValues = z.infer<typeof signInSchema>
