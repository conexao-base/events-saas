import { createContext, useContext, useState, type ReactNode } from 'react'
import { eventSchema } from '@conexao/shared/schemas/event.schema'
import { getZodErrors } from '@/utils/validations'

interface EventFormValidationContextData {
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  clearError: (path: string) => void
  clearErrors: () => void
  validateInfo: (data: unknown) => boolean
  validateRegistration: (data: unknown) => boolean
}

const EventFormValidationContext =
  createContext<EventFormValidationContextData | null>(null)

export function EventFormValidationProvider({
  children,
}: {
  children: ReactNode
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function clearError(path: string) {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[path]
      return next
    })
  }

  function clearErrors() {
    setErrors({})
  }

  function validateInfo(data: unknown): boolean {
    const result = eventSchema.shape.info.safeParse(data)

    if (!result.success) {
      const fieldErrors = getZodErrors(result.error)

      const mappedErrors: Record<string, string> = Object.fromEntries(
        Object.entries(fieldErrors).map(([path, message]) => [
          `info.${path}`,
          message,
        ])
      )

      setErrors(mappedErrors)
      return false
    }

    clearErrors()
    return true
  }

  function validateRegistration(data: unknown): boolean {
    const result = eventSchema.shape.registration.safeParse(data)

    if (!result.success) {
      const fieldErrors = getZodErrors(result.error)

      const mappedErrors: Record<string, string> = Object.fromEntries(
        Object.entries(fieldErrors).map(([path, message]) => [
          `registration.${path}`,
          message,
        ])
      )

      setErrors((prev) => ({
        ...prev,
        ...mappedErrors,
      }))

      return false
    }

    setErrors((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(
          ([path]) => !path.startsWith('registration.')
        )
      )
    )

    return true
  }

  return (
    <EventFormValidationContext.Provider
      value={{
        errors,
        setErrors,
        clearError,
        clearErrors,
        validateInfo,
        validateRegistration,
      }}
    >
      {children}
    </EventFormValidationContext.Provider>
  )
}

export function useEventFormValidation() {
  const context = useContext(EventFormValidationContext)

  if (!context) {
    throw new Error(
      'useEventFormValidation deve ser usado dentro de EventFormValidationProvider'
    )
  }

  return context
}
