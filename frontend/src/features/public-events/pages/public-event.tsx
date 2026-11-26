import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import { paymentService } from '@/services/event-payment.service'
import { useAuthStore } from '@/stores/auth-store'
import { Main } from '@/components/layout/main'
import { EventEnded } from '@/features/errors/event-ended'
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

  const {
    data: payment,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useQuery({
    queryKey: ['public-payment-options', eventId],
    queryFn: () => paymentService.findPublicOptions(eventId),
    enabled: !!event && event.status === 'published',
    retry: false,
  })

  const isLoadingPage =
    isLoading || isPaymentLoading || (Boolean(accessToken) && isAuthLoading)

  const isEnded = event?.status === 'ended'
  const isUnavailable = isError || !event

  return (
    <div className='relative flex min-h-screen flex-col'>
      <PublicHeader />

      <Main fluid loading={isLoadingPage} className='flex flex-1 flex-col'>
        {!isLoadingPage &&
          (isEnded ? (
            <EventEnded eventName={event.name} />
          ) : isUnavailable ? (
            <NotFoundError />
          ) : event.status === 'published' && payment && !isPaymentError ? (
            <PublicEventView
              event={event}
              payment={payment}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <NotFoundError />
          ))}
      </Main>

      <PublicFooter />
    </div>
  )
}
