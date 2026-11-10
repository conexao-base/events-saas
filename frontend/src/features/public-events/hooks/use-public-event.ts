import { useEffect, useState } from 'react'
import type { ApiEvent } from '@/services/event.service'
import { publicEventService } from '@/services/public-event.service'

export function usePublicEvent(id?: string) {
  const [event, setEvent] = useState<ApiEvent | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!id) {
      setEvent(null)
      setIsLoading(false)
      setIsError(true)
      return
    }

    const eventId = id

    async function loadEvent() {
      setIsLoading(true)
      setIsError(false)

      try {
        const data = await publicEventService.findById(eventId)

        if (!cancelled) setEvent(data)
      } catch {
        if (!cancelled) {
          setEvent(null)
          setIsError(true)
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

  return { event, isLoading, isError }
}
