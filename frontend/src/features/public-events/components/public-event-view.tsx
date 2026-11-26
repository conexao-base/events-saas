import type { CSSProperties } from 'react'
import { PublicPaymentOptions } from '@/services/event-payment.service'
import type { ApiEvent } from '@/services/event.service'
import { CalendarDays, MapPin, Tag } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { EventPaymentInfo } from './event-payment-info'
import { RegistrationForm } from './registration-form'

type PublicEventViewProps = {
  event: ApiEvent
  payment: PublicPaymentOptions
  isAuthenticated: boolean
}
export function PublicEventView({
  event,
  payment,
  isAuthenticated,
}: PublicEventViewProps) {
  const primaryColor = event.appearance.primaryColor

  const eventStyle = {
    '--event-primary': primaryColor,
  } as CSSProperties

  const dateRange = [
    event.start_date && formatDate(event.start_date),
    event.end_date && formatDate(event.end_date),
  ]
    .filter(Boolean)
    .join(' a ')

  const formattedPrice =
    event.price != null
      ? Number(event.price).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      : null

  return (
    <main className='min-h-screen bg-muted/30 lg:py-6' style={eventStyle}>
      <div className='mx-auto max-w-4xl'>
        <article className='overflow-hidden rounded-xl border bg-background shadow-sm'>
          <header
            className='relative flex min-h-64 flex-col justify-end bg-cover bg-center p-6 text-white sm:min-h-80 sm:p-10'
            style={{
              backgroundColor: primaryColor,
              backgroundImage: event.appearance.coverImage
                ? `linear-gradient(to top, rgb(0 0 0 / 75%), rgb(0 0 0 / 5%)), url("${event.appearance.coverImage}")`
                : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`,
            }}
          >
            {event.appearance.logo && (
              <div className='absolute top-6 right-6 flex size-16 items-center justify-center overflow-hidden rounded-xl border border-white/30 bg-white p-1 shadow-md'>
                <img
                  src={event.appearance.logo}
                  alt='Logo do evento'
                  className='size-full rounded-lg object-contain'
                />
              </div>
            )}

            <h1 className='max-w-xl text-3xl font-bold tracking-tight sm:text-4xl'>
              {event.name}
            </h1>

            <div className='mt-4 flex flex-wrap gap-4 text-sm text-white/90'>
              {dateRange && (
                <span className='flex items-center gap-2'>
                  <CalendarDays className='size-4' />
                  {dateRange}
                </span>
              )}

              {event.location && (
                <span className='flex items-center gap-2'>
                  <MapPin className='size-4' />
                  {event.location}
                </span>
              )}

              {formattedPrice && (
                <span className='flex items-center gap-2'>
                  <Tag className='size-4' />
                  {formattedPrice}
                </span>
              )}
            </div>
          </header>

          {(event.description || payment.lots.length > 0) && (
            <section className='border-b px-6 py-6 sm:px-10 sm:py-5'>
              <h2 className='text-xl font-semibold tracking-tight'>
                Informações Gerais
              </h2>

              {event.description && (
                <p className='mt-3 text-sm leading-7 whitespace-pre-wrap text-muted-foreground'>
                  {event.description}
                </p>
              )}

              <EventPaymentInfo
                enabled={payment.enabled}
                lots={payment.lots}
                primaryColor={primaryColor}
              />
            </section>
          )}

          <section className='px-6 py-6 sm:px-10 sm:py-5'>
            <RegistrationForm
              eventId={event.id}
              fields={event.registration_fields}
              primaryColor={primaryColor}
              isAuthenticated={isAuthenticated}
            />
          </section>
        </article>
      </div>
    </main>
  )
}
