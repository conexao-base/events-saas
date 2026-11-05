import { Link } from '@tanstack/react-router'
import type { ApiEvent } from '@/services/event.service'
import { CalendarDays, ExternalLink, Info, Users } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'

type Event = ApiEvent & {
  color?: string
  registrations?: number
}

type EventsCardProps = {
  event: Event
  onClick: () => void
}

export function EventsCard({ event, onClick }: EventsCardProps) {
  return (
    <article className='group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md'>
      <div className='relative flex h-32 items-center justify-center bg-muted/40'>
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
              className='flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground'
            >
              <ExternalLink size={14} />
            </Link>

            <button
              type='button'
              onClick={onClick}
              aria-label='Configurações gerais do evento'
              title='Configurações gerais'
              className='flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground'
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        <div className='flex items-center justify-between border-t pt-3'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Users size={17} />
            <span>Inscrições</span>
          </div>

          <span className='font-semibold tabular-nums'>
            {event.registrations ?? 0}
          </span>
        </div>
      </div>
    </article>
  )
}
