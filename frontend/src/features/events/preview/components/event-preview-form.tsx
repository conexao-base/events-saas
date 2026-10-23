import type { CSSProperties } from 'react'
import { useInfo } from '../../info/components/info-provider'
import { usePreview } from './preview-provider'
import { RegistrationFormPreview } from './registration-form-preview'

function formatDate(value: string) {
  if (!value) return ''

  const date = new Date(`${value.slice(0, 10)}T12:00:00`)

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function EventPreviewForm() {
  const { formData } = useInfo()
  const { appearance } = usePreview()

  const primaryColor = appearance.primaryColor || '#245C43'

  const dateRange = [
    formData.startDate && formatDate(formData.startDate),
    formData.endDate && formatDate(formData.endDate),
  ]
    .filter(Boolean)
    .join(' a ')

  const eventStyle = {
    '--event-primary': primaryColor,
  } as CSSProperties

  return (
    <div
      className='min-w-0 overflow-hidden rounded-lg border bg-background'
      style={eventStyle}
    >
      <div
        className='relative flex min-h-44 flex-col justify-end bg-cover bg-center p-6 text-white sm:min-h-52 sm:p-8'
        style={{
          backgroundColor: primaryColor,
          backgroundImage: appearance.coverImage
            ? `linear-gradient(to top, rgb(0 0 0 / 75%), rgb(0 0 0 / 5%)), url("${appearance.coverImage}")`
            : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`,
        }}
      >
        {appearance.logo && (
          <div className='absolute top-5 right-5 flex size-14 items-center justify-center overflow-hidden rounded-xl border border-white/30 bg-white p-1 shadow-md sm:size-16'>
            <img
              src={appearance.logo}
              alt='Logo do evento'
              className='h-full w-full rounded-lg object-contain'
            />
          </div>
        )}

        <h2 className='max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl'>
          {formData.name || 'Nome do evento'}
        </h2>

        <div className='mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/90'>
          {dateRange && <span>{dateRange}</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
      </div>

      {formData.description && (
        <div className='border-b px-5 py-4 text-foreground sm:px-6'>
          <p className='text-sm leading-relaxed whitespace-pre-wrap'>
            {formData.description}
          </p>
        </div>
      )}

      <RegistrationFormPreview />
    </div>
  )
}
