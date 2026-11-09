import { useQuery } from '@tanstack/react-query'
import { eventService } from '@/services/event.service'

export function useEvents() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.findAll,
  })

  return { events, isLoading }
}
