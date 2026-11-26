import type { BillingType } from '../../payments.types'

export interface PaymentLotFormData {
  name: string
  value: string
  startDate: string
  endDate: string
  capacity: string
  active: boolean
  billingTypes: BillingType[]
  maxInstallments: number
}
