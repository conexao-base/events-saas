import { createFileRoute } from '@tanstack/react-router'
import { Registration } from '@/features/events/registration'

export const Route = createFileRoute('/_authenticated/events/new/registration')({
  component: Registration,
})
