import { api } from '@/lib/api'
import type { RegistrationFieldType } from '@/features/events/registration/types/registration'

export interface EventInfoDTO {
  name: string
  description: string
  location: string
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
  registration_fields: RegistrationFieldDTO[]
  appearance: EventAppearanceDTO
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

  async findAll(): Promise<ApiEvent[]> {
    const { data } = await api.get<EventsResponse>('/events')

    return data.events
  },

  async findById(id: string): Promise<ApiEvent> {
    const { data } = await api.get<EventResponse>(`/events/${id}`)

    return data.event
  },
}
