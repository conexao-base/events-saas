import { createFileRoute } from '@tanstack/react-router'
import { Info } from '@/features/events/event-builder/info'

export const Route = createFileRoute('/_authenticated/events/$eventId/info')({
  component: EventInfo,
})

function EventInfo() {
  const { eventId } = Route.useParams()
  return <Info eventId={eventId} />
}
