import { publicApi } from '@/lib/public-api'

export interface City {
  id: number
  name: string
  state: string
  stateName: string
}

interface CitiesResponse {
  cities: City[]
}

export const ibgeService = {
  async searchCities(query: string): Promise<City[]> {
    const { data } = await publicApi.get<CitiesResponse>('/ibge/cities', {
      params: { query },
    })

    return data.cities
  },
}
