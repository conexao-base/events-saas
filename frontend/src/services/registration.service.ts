import { api } from '@/lib/api'
import { publicApi } from '@/lib/public-api'

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'

export type CreateRegistrationData = Record<
  string,
  string | number | boolean | null
>

export type UpdateRegistrationData = {
  data: CreateRegistrationData
  price: string
  status: RegistrationStatus
}

export interface ApiRegistration {
  id: string
  event_id: string
  data: CreateRegistrationData
  price: string
  status: RegistrationStatus
  created_at: string
  updated_at: string
}

interface RegistrationResponse {
  registration: ApiRegistration
}

interface RegistrationsResponse {
  registrations: ApiRegistration[]
}

export const registrationService = {
  // Inscrição pública
  async create(
    eventId: string,
    data: CreateRegistrationData
  ): Promise<ApiRegistration> {
    const { data: response } = await publicApi.post<RegistrationResponse>(
      `/registrations/${eventId}`,
      { data }
    )

    return response.registration
  },

  // Criação administrativa
  async createByAdmin(
    eventId: string,
    data: UpdateRegistrationData
  ): Promise<ApiRegistration> {
    const { data: response } = await api.post<RegistrationResponse>(
      `/registrations/admin/${eventId}`,
      data
    )

    return response.registration
  },

  async getByEvent(eventId: string): Promise<ApiRegistration[]> {
    const { data } = await api.get<RegistrationsResponse>(
      `/registrations/event/${eventId}`
    )

    return data.registrations
  },

  async update(
    registrationId: string,
    data: UpdateRegistrationData
  ): Promise<ApiRegistration> {
    const { data: response } = await api.put<RegistrationResponse>(
      `/registrations/${registrationId}`,
      data
    )

    return response.registration
  },

  async updateStatus(
    registrationId: string,
    status: RegistrationStatus
  ): Promise<void> {
    await api.patch(`/registrations/${registrationId}/status`, { status })
  },

  async remove(registrationId: string): Promise<void> {
    await api.delete(`/registrations/${registrationId}`)
  },
}
