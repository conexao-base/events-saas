import { useEffect, useState } from 'react'
import { eventService, type ApiEvent } from '@/services/event.service'
import { toast } from 'sonner'

export function useEvent(id?: string) {
  const [event, setEvent] = useState<ApiEvent | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(id))

  useEffect(() => {
    let cancelled = false

    if (!id) {
      setEvent(null)
      setIsLoading(false)
      return
    }

    async function loadEvent() {
      setIsLoading(true)

      try {
        const data = await eventService.findById(id!)

        if (!cancelled) setEvent(data)
      } catch {
        if (!cancelled) {
          toast.error('Não foi possível carregar o evento.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadEvent()

    return () => {
      cancelled = true
    }
  }, [id])

  return { event, isLoading }
}
