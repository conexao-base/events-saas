import React, { useState } from 'react'
import { type ApiRegistration } from '@/services/registration.service'
import useDialogState from '@/hooks/use-dialog-state'

type RegistrationsDialogType = 'add' | 'edit' | 'delete'

type RegistrationsContextType = {
  open: RegistrationsDialogType | null
  setOpen: (str: RegistrationsDialogType | null) => void
  currentRow: ApiRegistration | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ApiRegistration | null>>
}

const RegistrationsContext =
  React.createContext<RegistrationsContextType | null>(null)

export function RegistrationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<RegistrationsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ApiRegistration | null>(null)

  return (
    <RegistrationsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RegistrationsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRegistrations = () => {
  const registrationsContext = React.useContext(RegistrationsContext)

  if (!registrationsContext) {
    throw new Error(
      'useRegistrations has to be used within <RegistrationsContext>'
    )
  }

  return registrationsContext
}
