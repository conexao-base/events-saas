import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePayments } from '../../payments-provider'
import type { PaymentLot, PaymentLotPayload } from '../../payments.types'
import { PaymentLotForm } from './payment-lot-form'
import { PaymentLotList } from './payment-lot-list'

export function PaymentLots() {
  const { lots, addLot, updateLot, removeLot } = usePayments()
  const [editingLot, setEditingLot] = useState<PaymentLot | null>(null)

  async function handleSubmit(data: PaymentLotPayload) {
    if (editingLot) {
      await updateLot(editingLot.id, data)
      setEditingLot(null)
      return
    }

    await addLot(data)
  }

  async function handleDelete(lot: PaymentLot) {
    if (!window.confirm(`Deseja excluir o lote "${lot.name}"?`)) return

    await removeLot(lot.id)

    if (editingLot?.id === lot.id) {
      setEditingLot(null)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold'>Lotes de inscrição</h2>
        <p className='text-sm text-muted-foreground'>
          Configure os valores, períodos e limites de inscrições de cada lote.
        </p>
      </div>

      <PaymentLotForm
        key={editingLot?.id ?? 'new'}
        initialData={editingLot}
        onSubmit={handleSubmit}
        onCancel={() => setEditingLot(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lotes cadastrados</CardTitle>
          <CardDescription>
            Lotes disponíveis para as inscrições do evento.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <PaymentLotList
            lots={lots}
            onEdit={setEditingLot}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
