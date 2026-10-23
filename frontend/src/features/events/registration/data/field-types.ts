import type { RegistrationFieldType } from '@/features/events/registration/types/registration'

export const fieldTypes: {
  value: RegistrationFieldType
  label: string
}[] = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Opção (seleção)' },
]
