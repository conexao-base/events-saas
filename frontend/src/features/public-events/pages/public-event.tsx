import { useParams } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
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

  const isUnavailable = isError || !event || event.status !== 'published'

  return (
    <div className='relative flex min-h-screen flex-col'>
      <PublicHeader />

      <Main fluid loading={isLoading} className='flex flex-1 flex-col'>
        {!isLoading &&
          (isUnavailable ? (
            <NotFoundError />
          ) : (
            <PublicEventView event={event} />
          ))}
      </Main>

      <PublicFooter />
    </div>
  )
}
