import { createFileRoute } from '@tanstack/react-router'
import { PublicEventPage } from '@/features/public-events/pages/public-event'

export const Route = createFileRoute('/_public/event/$eventId')({
  component: PublicEventPage,
})