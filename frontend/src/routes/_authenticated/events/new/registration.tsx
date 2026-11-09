import { createFileRoute, redirect } from '@tanstack/react-router'
import { canAccessStep } from '@/features/events/event-form-steps'
import { Registration } from '@/features/events/registration'

export const Route = createFileRoute('/_authenticated/events/new/registration')(
  {
    beforeLoad: () => {
      if (!canAccessStep('registration')) {
        throw redirect({ to: '/events/new/info' })
      }
    },
    component: Registration,
  }
)
