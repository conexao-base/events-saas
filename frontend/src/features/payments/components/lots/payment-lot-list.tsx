import { Ticket } from 'lucide-react'
import type { PaymentLot } from '../../payments.types'
import { PaymentEmptyState } from '../../shared/payment-empty-state'
import { PaymentLotCard } from './payment-lot.card'

interface PaymentLotListProps {
  lots: PaymentLot[]
  onEdit: (lot: PaymentLot) => void
  onDelete: (lot: PaymentLot) => void
}

export function PaymentLotList({
  lots,
  onEdit,
  onDelete,
}: PaymentLotListProps) {
  if (!lots.length) {
    return (
      <PaymentEmptyState
        icon={Ticket}
        title='Nenhum lote cadastrado'
        description='Cadastre o primeiro lote usando o formulário acima.'
      />
    )
  }

  return (
    <div className='space-y-3'>
      {lots.map((lot) => (
        <PaymentLotCard
          key={lot.id}
          lot={lot}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
