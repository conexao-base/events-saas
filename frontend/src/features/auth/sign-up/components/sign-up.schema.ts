import { z } from 'zod'

export const signUpSchema = z
  .object({
    email: z.email({
      error: (issue) => {
        if (issue.input === '') {
          return 'Por favor, insira seu e-mail.'
        }

        return 'E-mail inválido.'
      },
    }),
    password: z
      .string()
      .min(1, 'Por favor insira sua senha.')
      .min(7, 'A senha deve ter pelo menos 7 caracteres.'),
    confirmPassword: z.string().min(1, 'Por favor confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não correspondem.',
    path: ['confirmPassword'],
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>
