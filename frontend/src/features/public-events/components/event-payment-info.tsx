import { CalendarDays, CreditCard } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import type { PaymentLot } from '@/features/payments/payments.types'

type EventPaymentInfoProps = {
  enabled: boolean
  lots: PaymentLot[]
  primaryColor: string
}

const billingTypeLabels: Record<string, string> = {
  PIX: 'Pix',
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão de crédito',
}

export function EventPaymentInfo({
  enabled,
  lots,
  primaryColor,
}: EventPaymentInfoProps) {
  const activeLots = lots
    .filter((lot) => lot.active)
    .sort((a, b) => a.position - b.position)

  if (!enabled || !activeLots.length) return null

  const formatPrice = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  return (
    <div className='mt-5'>
      <div className='divide-y rounded-lg border'>
        {activeLots.map((lot) => (
          <div
            key={lot.id}
            className='flex items-start justify-between gap-3 px-3 py-3 sm:px-4'
          >
            <div className='min-w-0'>
              <p className='text-sm font-medium'>{lot.name}</p>

              <div className='mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <CalendarDays className='size-3.5 shrink-0' />
                  {formatDate(lot.startDate)} até {formatDate(lot.endDate)}
                </span>

                <span className='flex items-center gap-1.5'>
                  <CreditCard className='size-3.5 shrink-0' />
                  {lot.billingTypes.map((type, index) => (
                    <span key={type}>
                      {index > 0 && ', '}
                      {billingTypeLabels[type] ?? type}
                      {type === 'CREDIT_CARD' &&
                        lot.maxInstallments > 1 &&
                        ` (até ${lot.maxInstallments}x)`}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <p
              className='shrink-0 text-base font-bold tracking-tight'
              style={{ color: primaryColor }}
            >
              {formatPrice(lot.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
