import { Outlet, createFileRoute } from '@tanstack/react-router'
import { EventFormProvider } from '@/features/events/event-builder/event-form-provider'

export const Route = createFileRoute('/_authenticated/events/new')({
  component: NewEventLayout,
})

function NewEventLayout() {
  return (
    <EventFormProvider>
      <Outlet />
    </EventFormProvider>
  )
}
