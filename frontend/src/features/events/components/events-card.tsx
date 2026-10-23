import type { ApiEvent } from '@/services/event.service'
import { ArrowUpRight, CalendarDays, Users } from 'lucide-react'

type Event = ApiEvent & {
  color?: string
  registrations?: number
}

type EventsCardProps = {
  event: Event
  onClick: () => void
}

function formatDate(date: string) {
  if (!date) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export function EventsCard({ event, onClick }: EventsCardProps) {
  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      role='button'
      tabIndex={0}
      className='group cursor-pointer overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md'
    >
      <div className='flex h-32 items-center justify-center bg-muted/40'>
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

          <ArrowUpRight
            size={18}
            className='shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
          />
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
