import type { ReactNode } from 'react'
import { EventFormValidationProvider } from '@/features/events/event-builder/event-form-validation-provider'
import { PreviewProvider } from '@/features/events/event-builder/preview/components/preview-provider'
import type { PreviewAppearance } from '@/features/events/event-builder/preview/types/preview'
import { RegistrationProvider } from '@/features/events/event-builder/registration/components/registration-provider'
import type { RegistrationField } from '@/features/events/event-builder/registration/types/registration'
import {
  InfoProvider,
  type InfoFormData,
} from './info/components/info-provider'

export interface EventFormInitialData {
  info: InfoFormData
  registration_fields: RegistrationField[]
  appearance: PreviewAppearance
}

interface EventFormProviderProps {
  children: ReactNode
  initialData?: EventFormInitialData
}

const initialInfo: InfoFormData = {
  name: '',
  description: '',
  location: '',
  price: '',
  startDate: '',
  endDate: '',
}

const initialFields: RegistrationField[] = [
  {
    id: 'full-name',
    label: 'Nome completo',
    type: 'text',
    required: true,
  },
  {
    id: 'email',
    label: 'E-mail',
    type: 'email',
    required: true,
  },
  {
    id: 'phone',
    label: 'Telefone',
    type: 'phone',
    required: true,
  },
  {
    id: 'cpf',
    label: 'CPF',
    type: 'cpf',
    required: true,
  },
  {
    id: 'birth-date',
    label: 'Data de nascimento',
    type: 'date',
    required: true,
  },
  {
    id: 'city',
    label: 'Cidade',
    type: 'city',
    required: true,
  },
]

const initialAppearance: PreviewAppearance = {
  primaryColor: '#245C43',
  coverImage: '',
  logo: '',
}

export function EventFormProvider({
  children,
  initialData,
}: EventFormProviderProps) {
  return (
    <EventFormValidationProvider>
      <InfoProvider initialData={initialData?.info ?? initialInfo}>
        <RegistrationProvider
          initialFields={initialData?.registration_fields ?? initialFields}
        >
          <PreviewProvider
            initialAppearance={initialData?.appearance ?? initialAppearance}
          >
            {children}
          </PreviewProvider>
        </RegistrationProvider>
      </InfoProvider>
    </EventFormValidationProvider>
  )
}
