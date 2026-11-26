import { Link } from '@tanstack/react-router'
import type { ApiEvent } from '@/services/event.service'
import { ExternalLink, Settings, Settings2, Trash2, Users } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { EventStatus } from './event-status'

type EventsCardProps = {
  event: ApiEvent
  onClick: () => void
  onDelete: () => void
}

const actionClass =
  'flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'

export function EventsCard({ event, onClick, onDelete }: EventsCardProps) {
  const coverImage = event.appearance?.coverImage
  const primaryColor = event.appearance?.primaryColor

  return (
    <article className='group overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:border-border/80 hover:shadow-md'>
      <div
        className='relative flex h-36 items-center justify-center bg-muted/40 bg-cover bg-center'
        style={{
          backgroundColor: primaryColor || undefined,
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
        }}
      >
        <div className='absolute top-3 right-3'>
          <EventStatus eventId={event.id} status={event.status} />
        </div>
      </div>

      <div className='space-y-4 p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0 space-y-1'>
            <h3 className='truncate text-lg font-semibold tracking-tight'>
              {event.name}
            </h3>

            <p className='text-sm text-muted-foreground'>
              {formatDate(event.start_date)}
              {' – '}
              {formatDate(event.end_date)}
            </p>
          </div>

          <div className='flex shrink-0 items-center gap-1'>
            <Link
              to='/event/$eventId'
              params={{ eventId: event.id }}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visualizar página pública do evento'
              title='Visualizar página pública'
              className={actionClass}
            >
              <ExternalLink size={18} />
            </Link>

            <button
              type='button'
              onClick={onClick}
              aria-label='Configurações do evento'
              title='Configurações do evento'
              className={actionClass}
            >
              <Settings2 size={19} />
            </button>

            <Link
              to='/events/$eventId/payments'
              params={{ eventId: event.id }}
              aria-label='Administrar pagamentos do evento'
              title='Administrar pagamentos'
              className={actionClass}
            >
              <Settings size={18} />
            </Link>
          </div>
        </div>

        <div className='flex items-center justify-between border-t pt-3'>
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

          <button
            type='button'
            onClick={onDelete}
            aria-label={`Excluir evento ${event.name}`}
            title='Excluir evento'
            className='flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
          >
            <Trash2 size={15} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </article>
  )
}
