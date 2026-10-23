import { createFileRoute } from '@tanstack/react-router'
import { Preview } from '@/features/events/preview'

export const Route = createFileRoute('/_authenticated/events/new/preview')({
  component: Preview,
})
