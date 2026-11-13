import { createFileRoute } from '@tanstack/react-router'
import { Info } from '@/features/events/event-builder/info'

export const Route = createFileRoute('/_authenticated/events/new/info')({
  component: Info,
})
