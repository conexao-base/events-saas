import { Dispatch, ReactNode, SetStateAction } from 'react'

export type PreviewAppearance = {
  primaryColor: string
  coverImage: string
  logo: string
}

export type PreviewContextType = {
  appearance: PreviewAppearance
  setAppearance: Dispatch<SetStateAction<PreviewAppearance>>
}

export type PreviewProviderProps = {
  children: ReactNode
  initialAppearance?: PreviewAppearance
}

export const defaultAppearance: PreviewAppearance = {
  primaryColor: '#245C43',
  coverImage: '',
  logo: '',
}
