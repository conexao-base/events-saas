import { publicApi } from '@/lib/public-api'
import type { ApiEvent } from './event.service'

interface PublicEventResponse {
  event: ApiEvent
}

export const publicEventService = {
  async findById(id: string): Promise<ApiEvent> {
    const { data } = await publicApi.get<PublicEventResponse>(
      `/public/events/${id}`
    )

    return data.event
  },
}
