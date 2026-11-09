import type { RegistrationFieldType } from '@/features/events/registration/types/registration'

export function formatRegistrationFieldValue(
  type: RegistrationFieldType,
  value: string
): string {
  const digits = value.replace(/\D/g, '')

  switch (type) {
    case 'cpf':
      return digits
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    case 'phone': {
      const numbers = digits.slice(0, 11)

      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
      }

      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }

    default:
      return value
  }
}

export function getRegistrationInputType(
  type: RegistrationFieldType
): 'text' | 'email' | 'tel' {
  switch (type) {
    case 'email':
      return 'email'

    case 'phone':
      return 'tel'

    default:
      return 'text'
  }
}

export function getRegistrationFieldPlaceholder(
  type: RegistrationFieldType
): string | undefined {
  switch (type) {
    case 'cpf':
      return '000.000.000-00'

    case 'phone':
      return '(00) 00000-0000'

    default:
      return undefined
  }
}

export function getRegistrationFieldMaxLength(
  type: RegistrationFieldType
): number | undefined {
  switch (type) {
    case 'cpf':
      return 14

    case 'phone':
      return 15

    default:
      return undefined
  }
}
