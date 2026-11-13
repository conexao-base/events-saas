import { createFileRoute } from '@tanstack/react-router'
import { Registration } from '@/features/events/event-builder/registration'

export const Route = createFileRoute(
  '/_authenticated/events/$eventId/registration'
)({
  component: EventRegistration,
})

function EventRegistration() {
  const { eventId } = Route.useParams()
  return <Registration eventId={eventId} />
}
