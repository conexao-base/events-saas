export type PublicRegistrationField = {
  id: string
  type: 'text' | 'email' | 'phone' | 'date' | 'select'
  label: string
  required: boolean
  options?: string[]
}

export type PublicEvent = {
  id: string
  name: string
  description: string
  location: string
  start_date: string
  end_date: string
  registration_fields: PublicRegistrationField[]
  appearance: {
    logo: string
    coverImage: string
    primaryColor: string
  }
  status: 'draft' | 'published'
}

export type CreateRegistrationDTO = {
  answers: Record<string, string>
}