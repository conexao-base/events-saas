import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth-store'
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

  const accessToken = useAuthStore((state) => state.auth.accessToken)

  const { data: user, isLoading: isAuthLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    enabled: Boolean(accessToken),
    retry: false,
  })

  const isAuthenticated = Boolean(user)

  const { event, isLoading, isError } = usePublicEvent(eventId)

  const isUnavailable = isError || !event || event.status !== 'published'

  return (
    <div className='relative flex min-h-screen flex-col'>
      <PublicHeader />

      <Main
        fluid
        loading={isLoading || (Boolean(accessToken) && isAuthLoading)}
        className='flex flex-1 flex-col'
      >
        {!isLoading &&
          !(Boolean(accessToken) && isAuthLoading) &&
          (isUnavailable ? (
            <NotFoundError />
          ) : (
            <PublicEventView event={event} isAuthenticated={isAuthenticated} />
          ))}
      </Main>

      <PublicFooter />
    </div>
  )
}
