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
  PaymentRule,
  PaymentRulePayload,
  PaymentSettings,
  PaymentSettingsPayload,
} from './payments.types'

interface PaymentsContextData {
  lots: PaymentLot[]
  rules: PaymentRule[]
  settings: PaymentSettings
  loading: boolean
  saving: boolean
  error: string | null

  reload: () => Promise<void>
  updateSettings: (data: PaymentSettingsPayload) => void
  addLot: (lot: PaymentLotPayload, rule: PaymentRulePayload) => void
  updateLot: (
    lotId: string,
    lot: PaymentLotPayload,
    rule: PaymentRulePayload
  ) => void
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

export function PaymentsProvider({ eventId, children }: PaymentsProviderProps) {
  const [lots, setLots] = useState<PaymentLot[]>([])
  const [rules, setRules] = useState<PaymentRule[]>([])
  const [settings, setSettings] = useState<PaymentSettings>(
    defaultSettings(eventId)
  )

  const [originalLots, setOriginalLots] = useState<PaymentLot[]>([])
  const [originalRules, setOriginalRules] = useState<PaymentRule[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [settingsData, lotsData, rulesData] = await Promise.all([
        paymentService.findSettings(eventId),
        paymentService.findLots(eventId),
        paymentService.findRules(eventId),
      ])

      setSettings(settingsData)
      setLots(lotsData)
      setRules(rulesData)

      setOriginalLots(lotsData)
      setOriginalRules(rulesData)
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

  // Somente altera o estado local.
  function updateSettings(data: PaymentSettingsPayload) {
    setSettings((prev) => ({ ...prev, ...data }))
  }

  // Somente adiciona ao estado local.
  function addLot(lot: PaymentLotPayload, rule: PaymentRulePayload) {
    const localId = crypto.randomUUID()

    setLots((prev) => [...prev, { ...lot, id: localId, eventId }])

    setRules((prev) => [...prev, { ...rule, id: localId }])
  }

  // Somente atualiza o estado local.
  function updateLot(
    lotId: string,
    lot: PaymentLotPayload,
    rule: PaymentRulePayload
  ) {
    setLots((prev) =>
      prev.map((item) => (item.id === lotId ? { ...item, ...lot } : item))
    )

    setRules((prev) =>
      prev.map((item) => (item.id === lotId ? { ...item, ...rule } : item))
    )
  }

  // Somente remove do estado local.
  function removeLot(lotId: string) {
    setLots((prev) => prev.filter((item) => item.id !== lotId))
    setRules((prev) => prev.filter((item) => item.id !== lotId))
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

        if (existingLot) {
          console.log('Payload enviado para atualizar lote:', payload)

          await paymentService.updateLot(eventId, id, payload)
        } else {
          await paymentService.createLot(eventId, payload)
        }
      }

      // Regras: identificar exclusões, atualizações e criações.
      const removedRules = originalRules.filter(
        (original) => !rules.some((current) => current.id === original.id)
      )

      for (const rule of removedRules) {
        await paymentService.removeRule(eventId, rule.id)
      }

      for (const rule of rules) {
        const existingRule = originalRules.find(
          (original) => original.id === rule.id
        )

        const { id, ...payload } = rule

        if (existingRule) {
          await paymentService.updateRule(eventId, id, payload)
        } else {
          await paymentService.createRule(eventId, payload)
        }
      }

      await reload()
    } finally {
      setSaving(false)
    }
  }

  return (
    <PaymentsContext.Provider
      value={{
        lots,
        rules,
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
