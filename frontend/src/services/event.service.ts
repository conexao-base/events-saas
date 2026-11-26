import { api } from '@/lib/api'
import { publicApi } from '@/lib/public-api'
import type { RegistrationFieldType } from '@/features/events/event-builder/registration/types/registration'

export interface EventInfoDTO {
  name: string
  description: string
  location: string
  price: string
  startDate: string
  endDate: string
}

export interface RegistrationFieldDTO {
  id: string
  label: string
  type: RegistrationFieldType
  required: boolean
  options?: string[]
}

export interface EventAppearanceDTO {
  primaryColor: string
  coverImage: string
  logo: string
}

export interface CreateEventDTO {
  info: EventInfoDTO
  registration: {
    fields: RegistrationFieldDTO[]
  }
  appearance: EventAppearanceDTO
}

export interface ApiEvent {
  id: string
  name: string
  description: string | null
  location: string | null
  start_date: string
  end_date: string
  price: number | string | null
  registration_count: number
  registration_fields: RegistrationFieldDTO[]
  appearance: EventAppearanceDTO
  status: 'draft' | 'published' | 'ended'
}

interface EventResponse {
  event: ApiEvent
}

interface EventsResponse {
  events: ApiEvent[]
}

export const eventService = {
  async create(payload: CreateEventDTO): Promise<ApiEvent> {
    const { data } = await api.post<EventResponse>('/events', payload)

    return data.event
  },

  async update(id: string, payload: CreateEventDTO): Promise<ApiEvent> {
    const { data } = await api.put<EventResponse>(`/events/${id}`, payload)

    return data.event
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/events/${id}`)
  },

  async findAll(): Promise<ApiEvent[]> {
    const { data } = await api.get<EventsResponse>('/events')

    return data.events
  },

  async findById(id: string): Promise<ApiEvent> {
    const { data } = await api.get<EventResponse>(`/events/${id}`)

    return data.event
  },

  async findPublicById(id: string): Promise<ApiEvent> {
    const { data } = await publicApi.get<EventResponse>(`/public/events/${id}`)

    return data.event
  },

  async updateStatus(
    id: string,
    status: 'draft' | 'published'
  ): Promise<ApiEvent> {
    const { data } = await api.patch<EventResponse>(`/events/${id}/status`, {
      status,
    })

    return data.event
  },
}
