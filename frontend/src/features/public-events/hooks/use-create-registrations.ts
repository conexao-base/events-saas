import { useMutation } from '@tanstack/react-query'
import type { CreatePublicRegistrationInput } from '@/services/registration.service'
import { registrationService } from '@/services/registration.service'

interface CreateRegistrationVariables {
  eventId: string
  input: CreatePublicRegistrationInput
}

export function useCreateRegistration() {
  return useMutation({
    mutationFn: ({ eventId, input }: CreateRegistrationVariables) =>
      registrationService.create(eventId, input),
  })
}
