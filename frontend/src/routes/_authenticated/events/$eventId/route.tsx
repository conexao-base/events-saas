import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { eventService } from '@/services/event.service'
import { EventFormProvider } from '@/features/events/event-form-provider'

export const Route = createFileRoute('/_authenticated/events/$eventId')({
  component: NewEventLayout,
})

function NewEventLayout() {
  const { eventId } = Route.useParams()

  const {
    data: event,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.findById(eventId),
  })

  const initialData = useMemo(() => {
    if (!event) return undefined

    return {
      info: {
        name: event.name,
        description: event.description ?? '',
        location: event.location ?? '',
        startDate: event.start_date.slice(0, 10),
        endDate: event.end_date.slice(0, 10),
      },
      registration_fields: event.registration_fields,
      appearance: event.appearance,
    }
  }, [event])

  if (isPending) {
    return <div className='p-6'>Carregando evento...</div>
  }

  if (isError || !initialData) {
    return (
      <div className='p-6 text-destructive'>
        Não foi possível carregar o evento.
      </div>
    )
  }

  return (
    <EventFormProvider initialData={initialData}>
      <Outlet />
    </EventFormProvider>
  )
}
