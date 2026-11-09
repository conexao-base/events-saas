import { useState } from 'react'
import type { ApiEvent } from '@/services/event.service'
import {
  formatRegistrationFieldValue,
  getRegistrationFieldMaxLength,
  getRegistrationFieldPlaceholder,
  getRegistrationInputType,
} from '@/utils/registration-field.utils'
import { CityInput } from '@/features/events/components/city-input'
import { DatePickerField } from '@/features/events/info/components/date-picker-field'

type RegistrationFormProps = {
  eventId: string
  fields: ApiEvent['registration_fields']
  primaryColor: string
}

export function RegistrationForm({
  fields,
  primaryColor,
}: RegistrationFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const inputClassName =
    'h-10 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[var(--event-primary)] focus-visible:ring-2 focus-visible:ring-[var(--event-primary)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'

  function handleChange(fieldId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [fieldId]: value,
    }))
  }

  return (
    <form
      className='space-y-6 overflow-visible'
      style={{ '--event-primary': primaryColor } as React.CSSProperties}
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
          <div key={field.id} className='relative min-w-0 space-y-2'>
            {field.type === 'date' ? (
              <DatePickerField
                id={field.id}
                label={field.label}
                value={answers[field.id] ?? ''}
                onChange={(value) => handleChange(field.id, value)}
                primaryColor={primaryColor}
                maxDate={new Date()}
                required={field.required}
              />
            ) : (
              <>
                <label htmlFor={field.id} className='text-sm font-medium'>
                  {field.label}

                  {field.required && (
                    <span className='ml-1 text-destructive'>*</span>
                  )}
                </label>

                {field.type === 'city' ? (
                  <CityInput
                    value={answers[field.id] ?? ''}
                    onChange={(value) => handleChange(field.id, value)}
                    primaryColor={primaryColor}
                    className={inputClassName}
                    placeholder='Digite o nome da cidade...'
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.id}
                    name={field.id}
                    required={field.required}
                    value={answers[field.id] ?? ''}
                    onChange={(event) =>
                      handleChange(field.id, event.target.value)
                    }
                    className={inputClassName}
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
                    type={getRegistrationInputType(field.type)}
                    inputMode={
                      field.type === 'cpf' || field.type === 'phone'
                        ? 'numeric'
                        : undefined
                    }
                    maxLength={getRegistrationFieldMaxLength(field.type)}
                    placeholder={getRegistrationFieldPlaceholder(field.type)}
                    required={field.required}
                    value={answers[field.id] ?? ''}
                    onChange={(event) =>
                      handleChange(
                        field.id,
                        formatRegistrationFieldValue(
                          field.type,
                          event.target.value
                        )
                      )
                    }
                    className={inputClassName}
                  />
                )}
              </>
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
