import type { RegistrationFieldType } from '@/features/events/event-builder/registration/types/registration'

export const fieldTypes: {
  value: RegistrationFieldType
  label: string
}[] = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'cpf', label: 'CPF' },
  { value: 'city', label: 'Cidade' },
  { value: 'date', label: 'Data de nascimento' },
  { value: 'select', label: 'Opção (seleção)' },
]
