import { useEffect, useState } from 'react'
import { eventService, type ApiEvent } from '@/services/event.service'
import { toast } from 'sonner'

export function useEvents() {
  const [events, setEvents] = useState<ApiEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await eventService.findAll()
        setEvents(data)
      } catch {
        toast.error('Não foi possível carregar os eventos.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadEvents()
  }, [])

  return {
    events,
    isLoading,
  }
}
