import { api } from '@/lib/api'
import { publicApi } from '@/lib/public-api'

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'

export type CreatePublicRegistrationInput = {
  data: CreateRegistrationData
  lotId?: string
  payment: {
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
    installmentCount: number
  }
}

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
  event_name?: string
  data: CreateRegistrationData
  payment_amount: string | number | null
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
    input: CreatePublicRegistrationInput
  ): Promise<ApiRegistration> {
    const { data: response } = await publicApi.post<RegistrationResponse>(
      `/registrations/${eventId}`,
      input
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

  // Todas as inscrições
  async getAll(): Promise<ApiRegistration[]> {
    const { data } = await api.get<RegistrationsResponse>('/registrations')

    return data.registrations
  },

  // Inscrições por evento
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
