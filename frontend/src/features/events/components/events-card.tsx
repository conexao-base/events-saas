import { Link } from '@tanstack/react-router'
import type { ApiEvent } from '@/services/event.service'
import { CalendarDays, ExternalLink, Info, Trash2, Users } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { EventStatus } from './event-status'

type Event = ApiEvent & {
  color?: string
}

type EventsCardProps = {
  event: Event
  onClick: () => void
  onDelete: () => void
}

export function EventsCard({ event, onClick, onDelete }: EventsCardProps) {
  return (
    <article className='group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md'>
      <div className='relative flex h-32 items-center justify-center bg-muted/40'>
        <div className='absolute top-3 right-3'>
          <EventStatus eventId={event.id} status={event.status} />
        </div>

        <div
          className={`flex size-16 items-center justify-center rounded-2xl ${
            event.color ?? 'bg-primary/10 text-primary'
          }`}
        >
          <CalendarDays size={30} strokeWidth={1.7} />
        </div>
      </div>

      <div className='space-y-4 p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h3 className='truncate font-semibold tracking-tight'>
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
              className='flex items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground shadow-none transition-colors hover:bg-transparent'
            >
              <ExternalLink size={22} />
            </Link>

            <button
              type='button'
              onClick={onClick}
              aria-label='Configurações gerais do evento'
              title='Configurações gerais'
              className='flex items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground shadow-none transition-colors hover:bg-transparent'
            >
              <Info size={22} />
            </button>
          </div>
        </div>

        <div className='flex items-center justify-between border-t pt-3'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Users size={17} />
            <span>Inscrições</span>
            <span className='font-semibold text-foreground tabular-nums'>
              {event.registration_count ?? 0}
            </span>
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
