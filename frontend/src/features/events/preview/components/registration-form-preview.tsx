import type { CSSProperties } from 'react'
import { useRegistration } from '../../registration/components/registration-provider'

const inputStyle = {
  '--tw-ring-color': 'var(--event-primary)',
} as CSSProperties

function getInputType(type: string) {
  if (type === 'phone' || type === 'text') {
    return 'text'
  }

  return type
}

function getPlaceholder(type: string, label: string) {
  switch (type) {
    case 'email':
      return 'seu@email.com'
    case 'phone':
      return '(00) 00000-0000'
    case 'date':
      return 'Selecione uma data'
    default:
      return `Digite ${label.toLowerCase()}`
  }
}

export function RegistrationFormPreview() {
  const { fields } = useRegistration()

  return (
    <section className='p-5 sm:p-6'>
      <h2 className='text-lg font-semibold'>Faça sua inscrição</h2>

      <p className='mt-1 text-sm text-muted-foreground'>
        Preencha os dados abaixo para garantir sua vaga no evento.
      </p>

      <form
        className='mt-5 space-y-4'
        onSubmit={(event) => event.preventDefault()}
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {fields.map((field) => (
            <div key={field.id} className='min-w-0 space-y-1.5'>
              <label
                htmlFor={`preview-${field.id}`}
                className='text-sm font-medium'
              >
                {field.label}
                {field.required && (
                  <span className='ml-1 text-destructive'>*</span>
                )}
              </label>

              {field.type === 'select' ? (
                <select
                  id={`preview-${field.id}`}
                  required={field.required}
                  defaultValue=''
                  disabled
                  className='h-10 w-full cursor-not-allowed rounded-md border bg-background px-3 text-sm opacity-70'
                  style={inputStyle}
                >
                  <option value='' disabled>
                    Selecione uma opção
                  </option>

                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`preview-${field.id}`}
                  type={getInputType(field.type)}
                  required={field.required}
                  placeholder={getPlaceholder(field.type, field.label)}
                  disabled
                  className='h-10 w-full cursor-not-allowed rounded-md border bg-background px-3 text-sm opacity-70'
                  style={inputStyle}
                />
              )}
            </div>
          ))}
        </div>

        <button
          type='button'
          disabled
          className='h-10 w-full cursor-not-allowed rounded-md px-4 text-sm font-medium text-white opacity-70'
          style={{ backgroundColor: 'var(--event-primary)' }}
        >
          Enviar inscrição
        </button>

        <p className='text-center text-xs text-muted-foreground'>
          Pré-visualização do formulário de inscrição.
        </p>
      </form>
    </section>
  )
}
