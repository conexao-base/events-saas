import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { eventService, type ApiEvent } from '@/services/event.service'
import { toast } from 'sonner'

export function useEvent(id?: string) {
  const queryClient = useQueryClient()
  const [event, setEvent] = useState<ApiEvent | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [isDeleting, setIsDeleting] = useState(false)

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

  async function deleteEvent() {
    if (!id) return false

    try {
      setIsDeleting(true)

      await eventService.remove(id)

      queryClient.setQueryData<ApiEvent[]>(['events'], (current) =>
        current?.filter((item) => item.id !== id)
      )

      queryClient.removeQueries({ queryKey: ['event', id] })

      toast.success('Evento excluído com sucesso!')

      return true
    } catch (error) {
      console.error('Erro ao excluir evento:', error)
      toast.error('Não foi possível excluir o evento.')

      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    event,
    isLoading,
    isDeleting,
    deleteEvent,
  }
}
