import type { City, IBGEMunicipality } from "../types/ibge.js";

const IBGE_API =
  "https://servicodados.ibge.gov.br/api/v1/localidades/municipios";

const CACHE_TTL = 24 * 60 * 60 * 1000;

let citiesCache: City[] = [];
let cacheUpdatedAt = 0;
let loadingCities: Promise<City[]> | null = null;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

async function getCities(): Promise<City[]> {
  const cacheIsValid =
    citiesCache.length > 0 && Date.now() - cacheUpdatedAt < CACHE_TTL;

  if (cacheIsValid) {
    return citiesCache;
  }

  if (loadingCities) {
    return loadingCities;
  }

  loadingCities = (async () => {
    const response = await fetch(`${IBGE_API}?orderBy=nome`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error("Não foi possível consultar os municípios do IBGE.");
    }

    const municipalities = (await response.json()) as IBGEMunicipality[];

    const cities = municipalities.map((municipality) => {
      const state =
        municipality["regiao-imediata"]?.["regiao-intermediaria"]?.UF ??
        municipality.microrregiao?.mesorregiao?.UF;

      return {
        id: municipality.id,
        name: municipality.nome,
        state: state?.sigla ?? "",
        stateName: state?.nome ?? "",
      };
    });

    citiesCache = cities;
    cacheUpdatedAt = Date.now();

    return cities;
  })();

  try {
    return await loadingCities;
  } finally {
    loadingCities = null;
  }
}

export class IBGEService {
  static async searchCities(query: string): Promise<City[]> {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return [];
    }

    const cities = await getCities();

    return cities
      .filter((city) =>
        normalize(`${city.name} ${city.state}`).includes(normalizedQuery),
      )
      .slice(0, 20);
  }
}
