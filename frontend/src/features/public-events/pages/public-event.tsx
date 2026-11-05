import { useParams } from '@tanstack/react-router'
import { PublicEventView } from '../components/public-event-view'
import { PublicFooter } from './public-footer'
import { PublicHeader } from './public-header'
import { usePublicEvent } from '../hooks/use-public-event'

export function PublicEventPage() {
  const { eventId } = useParams({
    from: '/_public/event/$eventId',
  })

  const { event, isLoading, isError } = usePublicEvent(eventId)

  if (isLoading) {
    return <p className='py-10 text-center'>Carregando evento...</p>
  }

  if (isError || !event) {
    return (
      <div className='flex min-h-screen flex-col'>
        <PublicHeader />

        <main className='flex flex-1 items-center justify-center px-4'>
          <p className='text-center text-muted-foreground'>
            Evento não encontrado ou indisponível.
          </p>
        </main>

        <PublicFooter />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <PublicHeader />

      <main className='flex-1'>
        <PublicEventView event={event} />
      </main>

      <PublicFooter />
    </div>
  )
}
