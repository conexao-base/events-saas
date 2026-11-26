import { Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import type { PaymentLot } from '../../payments.types'

interface PaymentLotCardProps {
  lot: PaymentLot
  onEdit: (lot: PaymentLot) => void
  onDelete: (lot: PaymentLot) => void
}

export function PaymentLotCard({ lot, onEdit, onDelete }: PaymentLotCardProps) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-4 rounded-lg border p-4'>
      <div className='min-w-0 space-y-2'>
        <div>
          <p className='font-medium'>{lot.name}</p>
          <p className='text-sm text-muted-foreground'>
            {formatDate(lot.startDate)} até {formatDate(lot.endDate)}
          </p>
        </div>

        <p className='text-xs text-muted-foreground'>
          {lot.capacity === null
            ? 'Inscrições ilimitadas'
            : `Limite: ${lot.capacity} inscrições`}
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <div className='text-right'>
          <p className='font-semibold'>
            {lot.value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
          <p className='text-xs text-muted-foreground'>
            {lot.active ? 'Ativo' : 'Inativo'}
          </p>
        </div>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => onEdit(lot)}
          aria-label={`Editar lote ${lot.name}`}
        >
          <Pencil className='size-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:text-destructive'
          onClick={() => onDelete(lot)}
          aria-label={`Excluir lote ${lot.name}`}
        >
          <Trash2 className='size-4' />
        </Button>
      </div>
    </div>
  )
}
