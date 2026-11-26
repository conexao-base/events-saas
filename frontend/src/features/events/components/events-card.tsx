import { Link } from '@tanstack/react-router'
import type { ApiEvent } from '@/services/event.service'
import { ExternalLink, Info, Trash2, Users, Wrench } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { EventStatus } from './event-status'

type EventsCardProps = {
  event: ApiEvent
  onClick: () => void
  onDelete: () => void
}

export function EventsCard({ event, onClick, onDelete }: EventsCardProps) {
  const coverImage = event.appearance?.coverImage
  const primaryColor = event.appearance?.primaryColor

  return (
    <article className='group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md'>
      <div
        className='relative flex h-32 items-center justify-center bg-muted/40 bg-cover bg-center'
        style={{
          backgroundColor: primaryColor || undefined,
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
        }}
      >
        <div className='absolute top-3 right-3 rounded-full border-3 border-white/65'>
          <EventStatus eventId={event.id} status={event.status} />
        </div>
      </div>

      <div className='space-y-4 p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h3 className='truncate text-2xl tracking-tight text-muted-foreground'>
              {event.name}
            </h3>

            <p className='mt-1 text-sm text-muted-foreground'>
              {formatDate(event.start_date)}
              {' – '}
              {formatDate(event.end_date)}
            </p>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Link
              to='/event/$eventId'
              params={{ eventId: event.id }}
              target='_blank'
              aria-label='Visualizar página pública do evento'
              title='Visualizar página pública'
              className='flex items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground shadow-none transition-colors hover:bg-transparent hover:text-foreground'
            >
              <ExternalLink size={22} />
            </Link>

            <button
              type='button'
              onClick={onClick}
              aria-label='Configurações gerais do evento'
              title='Configurações gerais'
              className='flex items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground shadow-none transition-colors hover:bg-transparent hover:text-foreground'
            >
              <Info size={22} />
            </button>

            <Link
              to='/events/$eventId/payments'
              params={{ eventId: event.id }}
              aria-label='Administrar pagamentos do evento'
              title='Administrar pagamentos'
              className='flex items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground shadow-none transition-colors hover:bg-transparent hover:text-foreground'
            >
              <Wrench size={22} />
            </Link>
          </div>
        </div>

        <div className='flex items-center justify-between border-t pt-3'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Link
              to='/events/$eventId/registrations'
              params={{ eventId: event.id }}
              className='flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground'
              title='Visualizar inscrições do evento'
            >
              <Users size={17} />
              <span>Inscrições</span>
              <span className='font-semibold text-foreground tabular-nums'>
                {event.registration_count ?? 0}
              </span>
            </Link>
          </div>

          <button
            type='button'
            onClick={onDelete}
            aria-label={`Excluir evento ${event.name}`}
            title='Excluir evento'
            className='flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10'
          >
            <Trash2 size={15} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </article>
  )
}
