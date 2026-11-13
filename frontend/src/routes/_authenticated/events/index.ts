import { createFileRoute } from '@tanstack/react-router'
import { Events } from '@/features/events/event-builder'

export const Route = createFileRoute('/_authenticated/events/')({
  component: Events,
})
