export type BillingType = 'PIX' | 'BOLETO' | 'CREDIT_CARD'

export interface PaymentSettings {
  id?: string
  eventId: string
  enabled: boolean
  dueDays: number
}

export interface PaymentSettingsPayload {
  enabled: boolean
  dueDays: number
}

export interface PaymentLot {
  id: string
  eventId: string
  name: string
  value: number
  startDate: string
  endDate: string
  capacity: number | null
  billingTypes: BillingType[]
  maxInstallments: number
  active: boolean
  position: number
}

export interface PaymentLotPayload {
  name: string
  value: number
  startDate: string
  endDate: string
  capacity: number | null
  billingTypes: BillingType[]
  maxInstallments: number
  active: boolean
  position: number
}
