import { publicApi } from '@/lib/public-api'

export interface CreateRegistrationData {
  [fieldId: string]: string | number | boolean | null
}

export interface ApiRegistration {
  id: string
  event_id: string
  data: CreateRegistrationData
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

interface RegistrationResponse {
  registration: ApiRegistration
}

export const registrationService = {
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
}
