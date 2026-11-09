import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventService } from '@/services/event.service'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

type EventStatusProps = {
  eventId: string
  status: 'draft' | 'published'
}

export function EventStatus({ eventId, status }: EventStatusProps) {
  const queryClient = useQueryClient()
  const isPublished = status === 'published'

  const mutation = useMutation({
    mutationFn: (newStatus: 'draft' | 'published') =>
      eventService.updateStatus(eventId, newStatus),

    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(['event', eventId], updatedEvent)
      queryClient.invalidateQueries({ queryKey: ['events'] })

      toast.success(
        updatedEvent.status === 'published'
          ? 'Evento publicado com sucesso!'
          : 'Evento despublicado com sucesso!'
      )
    },

    onError: () => {
      toast.error('Não foi possível atualizar o status do evento.')
    },
  })

  return (
    <div className='flex items-center gap-2'>
      <Switch
        checked={isPublished}
        disabled={mutation.isPending}
        onCheckedChange={(checked) =>
          mutation.mutate(checked ? 'published' : 'draft')
        }
        aria-label='Alterar status de publicação do evento'
      />
    </div>
  )
}
