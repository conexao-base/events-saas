import { createContext, useContext, useState } from 'react'
import {
  defaultAppearance,
  PreviewAppearance,
  PreviewContextType,
  PreviewProviderProps,
} from '../types/preview'

const PreviewContext = createContext<PreviewContextType | null>(null)

export function PreviewProvider({
  children,
  initialAppearance = defaultAppearance,
}: PreviewProviderProps) {
  const [appearance, setAppearance] = useState<PreviewAppearance>(() => ({
    ...defaultAppearance,
    ...initialAppearance,
  }))

  return (
    <PreviewContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </PreviewContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreview() {
  const context = useContext(PreviewContext)

  if (!context) {
    throw new Error('usePreview must be used within PreviewProvider')
  }

  return context
}
