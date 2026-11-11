import { useMutation } from '@tanstack/react-query'
import type { CreateRegistrationData } from '@/services/registration.service'
import { registrationService } from '@/services/registration.service'

interface CreateRegistrationVariables {
  eventId: string
  data: CreateRegistrationData
}

export function useCreateRegistration() {
  return useMutation({
    mutationFn: ({ eventId, data }: CreateRegistrationVariables) =>
      registrationService.create(eventId, data),
  })
}
