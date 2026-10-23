import { createContext, useContext } from 'react'
import type {
  RegistrationContextType,
  RegistrationProviderProps,
} from '@/features/events/registration/types/registration'
import { useRegistrationFields } from '../hooks/use-registration-field-list'

const RegistrationContext = createContext<RegistrationContextType | null>(null)

export function RegistrationProvider({
  children,
  initialFields,
}: RegistrationProviderProps) {
  const registration = useRegistrationFields({ initialFields })

  return (
    <RegistrationContext.Provider value={registration}>
      {children}
    </RegistrationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistration() {
  const context = useContext(RegistrationContext)

  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider')
  }

  return context
}
