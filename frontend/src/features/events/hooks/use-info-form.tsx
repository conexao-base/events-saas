import { useEffect } from 'react'
import { useInfo } from '@/features/events/event-builder/info/components/info-provider'
import { useEvent } from './use-event'

export function useInfoForm(eventId?: string) {
  const { setFormData } = useInfo()
  const { event, isLoading } = useEvent(eventId)

  useEffect(() => {
    if (!event) return

    setFormData({
      name: event.name ?? '',
      description: event.description ?? '',
      location: event.location ?? '',
      price: event.price != null ? String(event.price).replace('.', ',') : '',
      startDate: event.start_date?.slice(0, 10) ?? '',
      endDate: event.end_date?.slice(0, 10) ?? '',
    })
  }, [event, setFormData])

  return { isLoading }
}
