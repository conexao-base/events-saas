import { useEffect } from 'react'
import { useEvent } from './use-event'
import { useInfo } from '../info/components/info-provider'

export function useInfoForm(eventId?: string) {
  const { setFormData } = useInfo()
  const { event, isLoading } = useEvent(eventId)

  useEffect(() => {
    if (!event) return

    setFormData({
      name: event.name,
      description: event.description ?? '',
      location: event.location ?? '',
      startDate: event.start_date.slice(0, 10),
      endDate: event.end_date.slice(0, 10),
    })
  }, [event, setFormData])

  return { isLoading }
}
