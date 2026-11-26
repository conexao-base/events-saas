import type { InfoFormData } from './info/components/info-provider'
import type { PreviewAppearance } from './preview/types/preview'
import type { RegistrationField } from './registration/types/registration'

export interface EventFormDraft {
  info: InfoFormData
  registration_fields: RegistrationField[]
  appearance: PreviewAppearance
}

const STORAGE_KEY = 'conexao:event-form-draft'

export function getEventFormDraft(): Partial<EventFormDraft> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)

    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function updateEventFormDraft(data: Partial<EventFormDraft>) {
  const currentDraft = getEventFormDraft()

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...currentDraft,
      ...data,
    })
  )
}

export function clearEventFormDraft() {
  sessionStorage.removeItem(STORAGE_KEY)
}
