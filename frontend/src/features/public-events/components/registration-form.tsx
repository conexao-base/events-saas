import { useState } from 'react'
import type { ApiEvent } from '@/services/event.service'

type RegistrationFormProps = {
  eventId: string
  fields: ApiEvent['registration_fields']
}

export function RegistrationForm({ fields }: RegistrationFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  function handleChange(fieldId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [fieldId]: value,
    }))
  }

  return (
    <form className='space-y-6'>
      <div className='space-y-1'>
        <h2 className='text-xl font-semibold tracking-tight'>
          Faça sua inscrição
        </h2>

        <p className='text-sm text-muted-foreground'>
          Preencha os dados abaixo para garantir sua vaga no evento.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2'>
        {fields.map((field) => (
          <div key={field.id} className='min-w-0 space-y-2'>
            <label htmlFor={field.id} className='text-sm font-medium'>
              {field.label}

              {field.required && (
                <span className='ml-1 text-destructive'>*</span>
              )}
            </label>

            {field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                required={field.required}
                value={answers[field.id] ?? ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className='w-full rounded-md border bg-background px-3 py-2.5 text-sm transition-shadow outline-none focus:ring-2 focus:ring-ring'
              >
                <option value=''>Selecione uma opção</option>

                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type === 'phone' ? 'tel' : field.type}
                required={field.required}
                value={answers[field.id] ?? ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className='w-full rounded-md border bg-background px-3 py-2.5 text-sm transition-shadow outline-none focus:ring-2 focus:ring-ring'
              />
            )}
          </div>
        ))}
      </div>

      <button
        type='submit'
        className='mb-2 w-full rounded-md bg-[var(--event-primary)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
      >
        Confirmar inscrição
      </button>
    </form>
  )
}
