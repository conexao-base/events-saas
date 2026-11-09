export interface IBGEState {
  sigla: string
  nome: string
}

export interface IBGEMunicipality {
  id: number
  nome: string
  'regiao-imediata'?: {
    'regiao-intermediaria'?: {
      UF?: IBGEState
    }
  }
  microrregiao?: {
    mesorregiao?: {
      UF?: IBGEState
    }
  }
}

export interface City {
  id: number
  name: string
  state: string
  stateName: string
}

export interface CitiesResponse {
  cities: City[]
}