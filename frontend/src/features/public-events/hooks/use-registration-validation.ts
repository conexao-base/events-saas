import { useState } from 'react'
import type { ApiEvent } from '@/services/event.service'

type RegistrationField = ApiEvent['registration_fields'][number]

export function useRegistrationValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(
    fields: RegistrationField[],
    answers: Record<string, string>
  ) {
    const nextErrors: Record<string, string> = {}

    fields.forEach((field) => {
      const value = answers[field.id] ?? ''

      if (field.required && !value.trim()) {
        nextErrors[field.id] = 'Este campo é obrigatório.'
      }
    })

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  function clearError(fieldId: string) {
    setErrors((current) => {
      if (!current[fieldId]) return current

      const next = { ...current }
      delete next[fieldId]

      return next
    })
  }

  function clearErrors() {
    setErrors({})
  }

  return {
    errors,
    validate,
    clearError,
    clearErrors,
  }
}
