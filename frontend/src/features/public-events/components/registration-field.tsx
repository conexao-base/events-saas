import type { ApiEvent } from '@/services/event.service'
import { cn } from '@/lib/utils'
import {
  formatRegistrationFieldValue,
  getRegistrationFieldMaxLength,
  getRegistrationFieldPlaceholder,
  getRegistrationInputType,
} from '@/utils/registration-field.utils'
import { CityInput } from '@/features/events/components/city-input'
import { DatePickerField } from '@/features/events/info/components/date-picker-field'

type RegistrationFieldProps = {
  field: ApiEvent['registration_fields'][number]
  value: string
  error?: string
  primaryColor: string
  onChange: (value: string) => void
}

export function RegistrationField({
  field,
  value,
  error,
  primaryColor,
  onChange,
}: RegistrationFieldProps) {
  const inputClassName = cn(
    'h-10 w-full rounded-md border bg-background px-3 py-2.5 text-sm transition-colors outline-none',
    'placeholder:text-muted-foreground focus-visible:border-[var(--event-primary)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--event-primary)] focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error ? 'border-destructive' : 'border-input'
  )

  return (
    <div className='relative min-w-0 space-y-2'>
      {field.type === 'date' ? (
        <DatePickerField
          id={field.id}
          label={field.label}
          value={value}
          onChange={onChange}
          primaryColor={primaryColor}
          maxDate={new Date()}
          required={field.required}
        />
      ) : (
        <>
          <label htmlFor={field.id} className='text-sm font-medium'>
            {field.label}

            {field.required && <span className='ml-1 text-destructive'>*</span>}
          </label>

          {field.type === 'city' ? (
            <CityInput
              value={value}
              onChange={onChange}
              primaryColor={primaryColor}
              className={inputClassName}
              placeholder='Digite o nome da cidade...'
            />
          ) : field.type === 'select' ? (
            <select
              id={field.id}
              name={field.id}
              required={field.required}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className={inputClassName}
              aria-invalid={Boolean(error)}
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
              value={value}
              onChange={(event) =>
                onChange(
                  formatRegistrationFieldValue(field.type, event.target.value)
                )
              }
              className={inputClassName}
              aria-invalid={Boolean(error)}
            />
          )}
        </>
      )}

      {error && (
        <p className='text-sm text-destructive' role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}
