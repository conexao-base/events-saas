import { publicApi } from '@/lib/public-api'
import type { ApiEvent } from './event.service'

export interface PublicEventEnded {
  status: 'ended'
  name: string
}

export type PublicEvent = ApiEvent | PublicEventEnded

interface PublicEventResponse {
  event: PublicEvent
}

export const publicEventService = {
  async findById(id: string): Promise<PublicEvent> {
    const { data } = await publicApi.get<PublicEventResponse>(
      `/public/events/${id}`
    )

    return data.event
  },
}
