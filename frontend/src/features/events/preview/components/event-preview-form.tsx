import type { CSSProperties } from 'react'
import { formatDate } from '@/utils/formatDate'
import { useInfo } from '../../info/components/info-provider'
import { usePreview } from './preview-provider'
import { RegistrationFormPreview } from './registration-form-preview'

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
      {/* Header */}
      <div
        className='relative flex h-40 flex-col justify-end overflow-hidden bg-cover bg-center p-4 text-white sm:p-5'
        style={{
          backgroundColor: primaryColor,
          backgroundImage: appearance.coverImage
            ? `linear-gradient(to top, rgb(0 0 0 / 75%), rgb(0 0 0 / 5%)), url("${appearance.coverImage}")`
            : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`,
        }}
      >
        {appearance.logo && (
          <div className='absolute top-3 right-3 flex size-10 items-center justify-center overflow-hidden rounded-lg border border-white/30 bg-white p-1 shadow-md sm:size-11'>
            <img
              src={appearance.logo}
              alt='Logo do evento'
              className='h-full w-full rounded-md object-contain'
            />
          </div>
        )}

        <h2 className='max-w-xl text-lg font-bold tracking-tight text-white sm:text-xl'>
          {formData.name || 'Nome do evento'}
        </h2>

        <div className='mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/90'>
          {dateRange && <span>{dateRange}</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
      </div>

      {/* Descrição */}
      {formData.description && (
        <div className='border-b px-4 py-3 text-foreground'>
          <p className='text-xs leading-relaxed whitespace-pre-wrap'>
            {formData.description}
          </p>
        </div>
      )}

      <RegistrationFormPreview />
    </div>
  )
}
