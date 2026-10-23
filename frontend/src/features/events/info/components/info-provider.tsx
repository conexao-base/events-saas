import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

export type InfoFormData = {
  name: string
  description: string
  location: string
  startDate: string
  endDate: string
}

type InfoContextType = {
  formData: InfoFormData
  setFormData: Dispatch<SetStateAction<InfoFormData>>
}

type InfoProviderProps = {
  children: ReactNode
  initialData: InfoFormData
}

const InfoContext = createContext<InfoContextType | null>(null)

export function InfoProvider({ children, initialData }: InfoProviderProps) {
  const [formData, setFormData] = useState<InfoFormData>(() => ({
    ...initialData,
  }))

  return (
    <InfoContext.Provider value={{ formData, setFormData }}>
      {children}
    </InfoContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInfo() {
  const context = useContext(InfoContext)

  if (!context) {
    throw new Error('useInfo must be used within InfoProvider')
  }

  return context
}
