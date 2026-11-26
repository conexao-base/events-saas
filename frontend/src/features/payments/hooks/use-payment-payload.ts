import type {
  PaymentLotPayload,
  PaymentRulePayload,
  PaymentSettingsPayload,
} from '../payments.types'

interface PaymentSettingsFormData {
  enabled: boolean
  dueDays: number
}

interface PaymentLotFormData {
  name: string
  value: number | string
  startDate: string
  endDate: string
  capacity: number | null
  active: boolean
  position: number
}

interface PaymentRuleFormData {
  billingTypes: PaymentRulePayload['billingTypes']
  maxInstallments: number
}

export function usePaymentPayload() {
  function settingsPayload(
    data: PaymentSettingsFormData
  ): PaymentSettingsPayload {
    return {
      enabled: data.enabled,
      dueDays: Number(data.dueDays),
    }
  }

  function lotPayload(data: PaymentLotFormData): PaymentLotPayload {
    return {
      name: data.name.trim(),
      value: Number(data.value),
      startDate: data.startDate,
      endDate: data.endDate,
      capacity: data.capacity === null ? null : Number(data.capacity),
      active: data.active,
      position: Number(data.position),
    }
  }

  function rulePayload(
    data: PaymentRuleFormData,
    lot: PaymentLotFormData
  ): PaymentRulePayload {
    return {
      name: `Pagamento - ${lot.name.trim()}`,
      startDate: lot.startDate,
      endDate: lot.endDate,
      billingTypes: data.billingTypes,
      maxInstallments: data.billingTypes.includes('CREDIT_CARD')
        ? Number(data.maxInstallments)
        : 1,
      active: lot.active,
      position: Number(lot.position),
    }
  }

  return {
    settingsPayload,
    lotPayload,
    rulePayload,
  }
}
