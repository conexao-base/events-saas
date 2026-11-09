import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  getEventFormDraft,
  updateEventFormDraft,
} from '../../event-form-storage'

export type InfoFormData = {
  name: string
  description: string
  location: string
  price: string
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
    ...getEventFormDraft().info,
  }))

  useEffect(() => {
    updateEventFormDraft({ info: formData })
  }, [formData])

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
