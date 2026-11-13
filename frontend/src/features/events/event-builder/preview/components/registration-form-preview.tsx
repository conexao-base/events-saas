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
    <section className='p-4'>
      <h2 className='text-base font-semibold'>Faça sua inscrição</h2>

      <p className='mt-0.5 text-xs text-muted-foreground'>
        Preencha os dados abaixo para garantir sua vaga no evento.
      </p>

      <form
        className='mt-3 space-y-3'
        onSubmit={(event) => event.preventDefault()}
      >
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {fields.map((field) => (
            <div key={field.id} className='min-w-0 space-y-1'>
              <label
                htmlFor={`preview-${field.id}`}
                className='text-xs font-medium'
              >
                {field.label}
                {field.required && (
                  <span className='ml-0.5 text-destructive'>*</span>
                )}
              </label>

              {field.type === 'select' ? (
                <select
                  id={`preview-${field.id}`}
                  required={field.required}
                  defaultValue=''
                  disabled
                  className='h-8 w-full cursor-not-allowed rounded-md border bg-background px-2.5 text-xs opacity-70'
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
                  className='h-8 w-full cursor-not-allowed rounded-md border bg-background px-2.5 text-xs opacity-70'
                  style={inputStyle}
                />
              )}
            </div>
          ))}
        </div>

        <button
          type='button'
          disabled
          className='h-9 w-full cursor-not-allowed rounded-md px-3 text-xs font-medium text-white'
          style={{ backgroundColor: 'var(--event-primary)' }}
        >
          Confirmar inscrição
        </button>

        <p className='text-center text-[10px] text-muted-foreground'>
          Pré-visualização do formulário de inscrição.
        </p>
      </form>
    </section>
  )
}
