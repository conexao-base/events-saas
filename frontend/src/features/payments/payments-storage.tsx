import type { PaymentsData } from './payments.types'

const STORAGE_KEY = 'payments-data'

export const defaultPaymentsData: PaymentsData = {
  lots: [],
  rules: [],
  settings: {
    enabled: true,
    due_days: 3,
  },
}

export function getPaymentsData(): PaymentsData {
  try {
    const storedData = sessionStorage.getItem(STORAGE_KEY)

    if (!storedData) return defaultPaymentsData

    const parsedData = JSON.parse(storedData)

    return {
      lots: Array.isArray(parsedData.lots) ? parsedData.lots : [],
      rules: Array.isArray(parsedData.rules) ? parsedData.rules : [],
      settings: {
        ...defaultPaymentsData.settings,
        ...parsedData.settings,
      },
    }
  } catch {
    return defaultPaymentsData
  }
}

export function savePaymentsData(data: PaymentsData) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
