import { useParams } from '@tanstack/react-router'
import { NotFoundError } from '@/features/errors/not-found-error'
import { PublicEventView } from '../components/public-event-view'
import { usePublicEvent } from '../hooks/use-public-event'
import { PublicFooter } from './public-footer'
import { PublicHeader } from './public-header'

export function PublicEventPage() {
  const { eventId } = useParams({
    from: '/_public/event/$eventId',
  })

  const { event, isLoading, isError } = usePublicEvent(eventId)

  if (isLoading) {
    return <p className='py-10 text-center'>Carregando evento...</p>
  }

  const isUnavailable = isError || !event || event.status !== 'published'

  return (
    <div className='flex min-h-screen flex-col'>
      <PublicHeader />

      <main className='flex flex-1 flex-col'>
        {isUnavailable ? <NotFoundError /> : <PublicEventView event={event} />}
      </main>

      <PublicFooter />
    </div>
  )
}
