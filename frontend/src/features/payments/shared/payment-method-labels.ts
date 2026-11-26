import type { BillingType } from "../payments.types"

export const billingLabels: Record<BillingType, string> = {
  PIX: 'PIX',
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão de crédito',
}

export const billingOptions = Object.entries(billingLabels).map(
  ([value, label]) => ({
    value: value as BillingType,
    label,
  })
)
