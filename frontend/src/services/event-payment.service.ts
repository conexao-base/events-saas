import { api } from '@/lib/api'
import { publicApi } from '@/lib/public-api'
import type {
  BillingType,
  PaymentLot,
  PaymentLotPayload,
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

interface LotsResponse {
  lots: ApiPaymentLot[]
}

interface LotResponse {
  lot: ApiPaymentLot
}

interface ApiPaymentLot {
  id: string
  event_id: string
  name: string
  value: number | string
  start_date: string
  end_date: string
  capacity: number | null
  billing_types: BillingType[] | string
  max_installments: number
  active: boolean
  position: number
}

interface ApiPublicPaymentLot {
  id: string
  name: string
  value: number | string
  startDate: string
  endDate: string
  capacity: number | null
  billingTypes: BillingType[]
  maxInstallments: number
  active: boolean
  position: number
}

interface PublicPaymentOptionsResponse {
  payment: {
    enabled: boolean
    lots: ApiPublicPaymentLot[]
  }
}

export interface PublicPaymentOptions {
  enabled: boolean
  lots: PaymentLot[]
}

function mapSettings(data: SettingsResponse['settings']): PaymentSettings {
  return {
    id: data.id,
    eventId: data.event_id,
    enabled: data.enabled,
    dueDays: data.due_days,
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
    billingTypes:
      typeof data.billing_types === 'string'
        ? JSON.parse(data.billing_types)
        : data.billing_types,
    maxInstallments: data.max_installments,
    active: data.active,
    position: data.position,
  }
}

function mapPublicLot(data: ApiPublicPaymentLot): PaymentLot {
  return {
    id: data.id,
    eventId: '',
    name: data.name,
    value: Number(data.value),
    startDate: data.startDate,
    endDate: data.endDate,
    capacity: data.capacity,
    billingTypes: data.billingTypes,
    maxInstallments: data.maxInstallments,
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
    const { data } = await api.post<LotResponse>(
      `/events/${eventId}/payment-lots`,
      payload
    )

    return mapLot(data.lot)
  },

  async updateLot(
    eventId: string,
    lotId: string,
    payload: PaymentLotPayload
  ): Promise<PaymentLot> {
    const { data } = await api.put<LotResponse>(
      `/events/${eventId}/payment-lots/${lotId}`,
      payload
    )

    return mapLot(data.lot)
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
      lots: data.payment.lots.map(mapPublicLot),
    }
  },
}
