import type { CSSProperties, FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ApiEvent } from '@/services/event.service'
import { toast } from 'sonner'
import { useCreateRegistration } from '../hooks/use-create-registrations'
import { useRegistrationValidation } from '../hooks/use-registration-validation'
import { RegistrationField } from './registration-field'

type RegistrationFormProps = {
  eventId: string
  fields: ApiEvent['registration_fields']
  primaryColor: string
  isAuthenticated: boolean
}

export function RegistrationForm({
  eventId,
  fields,
  primaryColor,
  isAuthenticated,
}: RegistrationFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const { errors, validate, clearError, clearErrors } =
    useRegistrationValidation()

  const createRegistration = useCreateRegistration()
  const navigate = useNavigate()

  function handleChange(fieldId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [fieldId]: value,
    }))

    clearError(fieldId)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validate(fields, answers)) {
      toast.error('Verifique os campos obrigatórios.')
      return
    }

    createRegistration.mutate(
      { eventId, data: answers },
      {
        onSuccess: () => {
          toast.success('Inscrição realizada com sucesso!')

          if (isAuthenticated) {
            navigate({ to: '/' })
            return
          }

          setAnswers({})
          clearErrors()
        },
        onError: () => {
          toast.error(
            'Não foi possível realizar sua inscrição. Tente novamente.'
          )
        },
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className='space-y-6 overflow-visible'
      style={{ '--event-primary': primaryColor } as CSSProperties}
    >
      <div className='space-y-1'>
        <h2 className='text-xl font-semibold tracking-tight'>
          Faça sua inscrição
        </h2>

        <p className='text-sm text-muted-foreground'>
          Preencha os dados abaixo para garantir sua vaga no evento.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-x-6 gap-y-5 overflow-visible sm:grid-cols-2'>
        {fields.map((field) => (
          <RegistrationField
            key={field.id}
            field={field}
            value={answers[field.id] ?? ''}
            error={errors[field.id]}
            primaryColor={primaryColor}
            onChange={(value) => handleChange(field.id, value)}
          />
        ))}
      </div>

      <button
        type='submit'
        disabled={createRegistration.isPending}
        className='mb-2 w-full rounded-md bg-[var(--event-primary)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {createRegistration.isPending
          ? 'Enviando inscrição...'
          : 'Confirmar inscrição'}
      </button>
    </form>
  )
}
