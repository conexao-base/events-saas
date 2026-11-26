import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { paymentService } from '@/services/event-payment.service'
import type {
  PaymentLot,
  PaymentLotPayload,
  PaymentSettings,
  PaymentSettingsPayload,
} from './payments.types'

interface PaymentsContextData {
  lots: PaymentLot[]
  settings: PaymentSettings
  loading: boolean
  saving: boolean
  error: string | null

  reload: () => Promise<void>
  updateSettings: (data: PaymentSettingsPayload) => void
  addLot: (lot: PaymentLotPayload) => void
  updateLot: (lotId: string, lot: PaymentLotPayload) => void
  removeLot: (lotId: string) => void
  saveAll: (settings: PaymentSettingsPayload) => Promise<void>
}

const PaymentsContext = createContext<PaymentsContextData | null>(null)

interface PaymentsProviderProps {
  eventId: string
  children: ReactNode
}

const defaultSettings = (eventId: string): PaymentSettings => ({
  eventId,
  enabled: false,
  dueDays: 1,
})

function normalizeDate(date: string) {
  return date.slice(0, 10)
}

export function PaymentsProvider({ eventId, children }: PaymentsProviderProps) {
  const [lots, setLots] = useState<PaymentLot[]>([])
  const [settings, setSettings] = useState<PaymentSettings>(
    defaultSettings(eventId)
  )

  const [originalLots, setOriginalLots] = useState<PaymentLot[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [settingsData, lotsData] = await Promise.all([
        paymentService.findSettings(eventId),
        paymentService.findLots(eventId),
      ])

      setSettings(settingsData)
      setLots(lotsData)
      setOriginalLots(lotsData)
    } catch (err) {
      setError('Não foi possível carregar os dados de pagamento.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    reload().catch(() => {})
  }, [reload])

  // Configurações gerais
  function updateSettings(data: PaymentSettingsPayload) {
    setSettings((prev) => ({ ...prev, ...data }))
  }

  // Lotes
  function addLot(lot: PaymentLotPayload) {
    const localId = crypto.randomUUID()

    setLots((prev) => [...prev, { ...lot, id: localId, eventId }])
  }

  function updateLot(lotId: string, lot: PaymentLotPayload) {
    setLots((prev) =>
      prev.map((item) => (item.id === lotId ? { ...item, ...lot } : item))
    )
  }

  function removeLot(lotId: string) {
    setLots((prev) => prev.filter((item) => item.id !== lotId))
  }

  async function saveAll(data: PaymentSettingsPayload) {
    try {
      setSaving(true)
      setError(null)

      await paymentService.updateSettings(eventId, data)

      // Excluir lotes removidos.
      const removedLots = originalLots.filter(
        (original) => !lots.some((current) => current.id === original.id)
      )

      for (const lot of removedLots) {
        await paymentService.removeLot(eventId, lot.id)
      }

      // Atualizar ou criar lotes.
      for (const lot of lots) {
        const existingLot = originalLots.find(
          (original) => original.id === lot.id
        )

        const { id, eventId: _, ...payload } = lot

        const normalizedPayload = {
          ...payload,
          startDate: normalizeDate(payload.startDate),
          endDate: normalizeDate(payload.endDate),
        }

        if (existingLot) {
          await paymentService.updateLot(eventId, id, normalizedPayload)
        } else {
          await paymentService.createLot(eventId, normalizedPayload)
        }
      }

      await reload()
    } catch (err) {
      setError('Não foi possível salvar as configurações de pagamento.')
      throw err
    } finally {
      setSaving(false)
    }
  }

  return (
    <PaymentsContext.Provider
      value={{
        lots,
        settings,
        loading,
        saving,
        error,
        reload,
        updateSettings,
        addLot,
        updateLot,
        removeLot,
        saveAll,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  )
}

export function usePayments() {
  const context = useContext(PaymentsContext)

  if (!context) {
    throw new Error(
      'usePayments deve ser utilizado dentro de PaymentsProvider.'
    )
  }

  return context
}
