import { createFileRoute } from '@tanstack/react-router'
import { Preview } from '@/features/events/preview'

export const Route = createFileRoute('/_authenticated/events/$eventId/preview')(
  {
    component: EventPreviewRoute,
  }
)

function EventPreviewRoute() {
  const { eventId } = Route.useParams()

  return <Preview eventId={eventId} />
}
