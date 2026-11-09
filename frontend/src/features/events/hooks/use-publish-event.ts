import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { CreateEventDTO } from '@/services/event.service'
import { eventService } from '@/services/event.service'
import { toast } from 'sonner'
import type { RegistrationField } from '@/features/events/registration/types/registration'
import { PreviewAppearance } from '../preview/types/preview'

type UsePublishEventProps = {
  eventId?: string
}

type PublishEventPayload = CreateEventDTO & {
  status: 'published'
}

type UsePublishEventParams = {
  formData: CreateEventDTO['info']
  fields: RegistrationField[]
  appearance: PreviewAppearance
}

export function usePublishEvent({ eventId }: UsePublishEventProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)

  async function publishEvent({
    formData,
    fields,
    appearance,
  }: UsePublishEventParams) {
    const payload: PublishEventPayload = {
      info: formData,
      registration: { fields },
      appearance,
      status: 'published',
    }

    try {
      setIsSaving(true)

      if (eventId) {
        const updatedEvent = await eventService.update(eventId, payload)

        queryClient.setQueryData(['event', eventId], updatedEvent)

        toast.success('Evento atualizado com sucesso!')
      } else {
        await eventService.create(payload)

        toast.success('Evento criado com sucesso!')
      }

      await queryClient.invalidateQueries({
        queryKey: ['events'],
      })

      await navigate({ to: '/events' })
    } catch (error) {
      console.error('Erro ao salvar evento:', error)

      toast.error(
        eventId
          ? 'Não foi possível atualizar o evento.'
          : 'Não foi possível criar o evento.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isSaving,
    publishEvent,
  }
}
