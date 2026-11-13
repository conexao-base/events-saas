import type { UseFormReturn } from 'react-hook-form'
import type { RegistrationStatus } from '@/services/registration.service'
import type { RegistrationInput } from '@conexao/shared/schemas/registration.schema'

export type RegistrationForm = RegistrationInput & {
  status: RegistrationStatus
}

export type RegistrationFormMethods = UseFormReturn<
  RegistrationForm,
  undefined,
  RegistrationForm
>
