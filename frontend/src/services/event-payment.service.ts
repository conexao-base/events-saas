import { api } from '@/lib/api'
import { publicApi } from '@/lib/public-api'
import type {
  PaymentLot,
  PaymentLotPayload,
  PaymentRule,
  PaymentRulePayload,
  PaymentSettings,
  PaymentSettingsPayload,
} from '@/features/payments/payments.types'

interface SettingsResponse {
  settings: {
    id?: string
    event_id: string
    enabled: boolean
    due_days: number
  }
}

interface RulesResponse {
  rules: ApiPaymentRule[]
}

interface LotsResponse {
  lots: ApiPaymentLot[]
}

interface ApiPaymentRule {
  id: string
  name: string
  start_date: string
  end_date: string
  billing_types: string[] | string
  max_installments: number
  active: boolean
  position: number
}

interface ApiPaymentLot {
  id: string
  event_id: string
  name: string
  value: number | string
  start_date: string
  end_date: string
  capacity: number | null
  active: boolean
  position: number
}

interface PublicPaymentOptionsResponse {
  payment: {
    enabled: boolean
    lots: ApiPaymentLot[]
    rules: ApiPaymentRule[]
  }
}

export interface PublicPaymentOptions {
  enabled: boolean
  lots: PaymentLot[]
  rules: PaymentRule[]
}

function mapSettings(data: SettingsResponse['settings']): PaymentSettings {
  return {
    id: data.id,
    eventId: data.event_id,
    enabled: data.enabled,
    dueDays: data.due_days,
  }
}

function mapRule(data: ApiPaymentRule): PaymentRule {
  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date,
    endDate: data.end_date,
    billingTypes:
      typeof data.billing_types === 'string'
        ? JSON.parse(data.billing_types)
        : (data.billing_types ?? []),
    maxInstallments: data.max_installments,
    active: data.active,
    position: data.position,
  }
}

function mapLot(data: ApiPaymentLot): PaymentLot {
  return {
    id: data.id,
    eventId: data.event_id,
    name: data.name,
    value: Number(data.value),
    startDate: data.start_date,
    endDate: data.end_date,
    capacity: data.capacity,
    active: data.active,
    position: data.position,
  }
}

export const paymentService = {
  async findSettings(eventId: string): Promise<PaymentSettings> {
    const { data } = await api.get<SettingsResponse>(
      `/events/${eventId}/payment-settings`
    )

    return mapSettings(data.settings)
  },

  async updateSettings(
    eventId: string,
    payload: PaymentSettingsPayload
  ): Promise<PaymentSettings> {
    const { data } = await api.put<SettingsResponse>(
      `/events/${eventId}/payment-settings`,
      payload
    )

    return mapSettings(data.settings)
  },

  async findRules(eventId: string): Promise<PaymentRule[]> {
    const { data } = await api.get<RulesResponse>(
      `/events/${eventId}/payment-rules`
    )

    return data.rules.map(mapRule)
  },

  async createRule(
    eventId: string,
    payload: PaymentRulePayload
  ): Promise<PaymentRule> {
    const { data } = await api.post<ApiPaymentRule>(
      `/events/${eventId}/payment-rules`,
      payload
    )

    return mapRule(data)
  },

  async updateRule(
    eventId: string,
    ruleId: string,
    payload: PaymentRulePayload
  ): Promise<PaymentRule> {
    const { data } = await api.put<ApiPaymentRule>(
      `/events/${eventId}/payment-rules/${ruleId}`,
      payload
    )

    return mapRule(data)
  },

  async removeRule(eventId: string, ruleId: string): Promise<void> {
    await api.delete(`/events/${eventId}/payment-rules/${ruleId}`)
  },

  async findLots(eventId: string): Promise<PaymentLot[]> {
    const { data } = await api.get<LotsResponse>(
      `/events/${eventId}/payment-lots`
    )

    return data.lots.map(mapLot)
  },

  async createLot(
    eventId: string,
    payload: PaymentLotPayload
  ): Promise<PaymentLot> {
    const { data } = await api.post<ApiPaymentLot>(
      `/events/${eventId}/payment-lots`,
      payload
    )

    return mapLot(data)
  },

  async updateLot(
    eventId: string,
    lotId: string,
    payload: PaymentLotPayload
  ): Promise<PaymentLot> {
    const { data } = await api.put<ApiPaymentLot>(
      `/events/${eventId}/payment-lots/${lotId}`,
      payload
    )

    return mapLot(data)
  },

  async removeLot(eventId: string, lotId: string): Promise<void> {
    await api.delete(`/events/${eventId}/payment-lots/${lotId}`)
  },

  async findPublicOptions(eventId: string): Promise<PublicPaymentOptions> {
    const { data } = await publicApi.get<PublicPaymentOptionsResponse>(
      `/events/${eventId}/public-payment-options`
    )

    return {
      enabled: data.payment.enabled,
      lots: data.payment.lots.map(mapLot),
      rules: data.payment.rules.map(mapRule),
    }
  },
}
