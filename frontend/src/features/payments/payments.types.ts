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

export interface PaymentRule {
  id: string
  name: string
  startDate: string
  endDate: string
  billingTypes: BillingType[]
  maxInstallments: number
  active: boolean
  position: number
}

export interface PaymentRulePayload {
  name: string
  startDate: string
  endDate: string
  billingTypes: BillingType[]
  maxInstallments: number
  active: boolean
  position: number
}

export interface PaymentLot {
  id: string
  eventId: string
  name: string
  value: number
  startDate: string
  endDate: string
  capacity: number | null
  active: boolean
  position: number
}

export interface PaymentLotPayload {
  name: string
  value: number
  startDate: string
  endDate: string
  capacity: number | null
  active: boolean
  position: number
}
