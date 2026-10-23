export type RegistrationFieldType =
  'text' | 'email' | 'phone' | 'date' | 'select'

export type RegistrationField = {
  id: string
  label: string
  type: RegistrationFieldType
  required: boolean
  options?: string[]
  mask?: string
}

export type RegistrationContextType = {
  fields: RegistrationField[]
  addField: () => void
  updateField: (id: string, changes: Partial<RegistrationField>) => void
  removeField: (id: string) => void
  reorderFields: (activeId: string, overId: string) => void
}

export type RegistrationProviderProps = {
  children: React.ReactNode
  initialFields: RegistrationField[]
}
