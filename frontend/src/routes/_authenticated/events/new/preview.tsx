import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  canAccessStep,
  getFirstPendingStep,
} from '@/features/events/event-form-steps'
import { Preview } from '@/features/events/preview'

export const Route = createFileRoute('/_authenticated/events/new/preview')({
  beforeLoad: () => {
    if (!canAccessStep('preview')) {
      const pendingStep = getFirstPendingStep()

      throw redirect({
        to:
          pendingStep === 'info'
            ? '/events/new/info'
            : '/events/new/registration',
      })
    }
  },
  component: Preview,
})
