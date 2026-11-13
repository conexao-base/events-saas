import { type ColumnDef } from '@tanstack/react-table'
import type { RegistrationFieldDTO } from '@/services/event.service'
import {
  type ApiRegistration,
  type RegistrationStatus,
} from '@/services/registration.service'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

const statusLabels: Record<RegistrationStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
}

const statusColors: Record<RegistrationStatus, string> = {
  pending: 'border-yellow-500/50 text-yellow-600',
  confirmed: 'border-green-500/50 text-green-600',
  cancelled: 'border-red-500/50 text-red-600',
}

function formatDate(value: unknown): string {
  if (!value) return '-'

  const dateString = String(value)

  // Evita conversão de fuso horário em datas sem horário.
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (match) {
    const [, year, month, day] = match
    return `${day}/${month}/${year}`
  }

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatValue(value: unknown, type?: string): string {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (type === 'date') {
    return formatDate(value)
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não'
  }

  return String(value)
}

function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === '') {
    return 'Gratuito'
  }

  const value = Number(price)

  if (Number.isNaN(value)) {
    return 'Gratuito'
  }

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function createRegistrationsColumns(
  fields: RegistrationFieldDTO[]
): ColumnDef<ApiRegistration>[] {
  const registrationFields: ColumnDef<ApiRegistration>[] = fields.map(
    (field, index) => ({
      id: field.id,
      accessorFn: (row) => row.data[field.id],
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={field.label} />
      ),
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <LongText className='max-w-40 text-center'>
            {formatValue(row.original.data[field.id], field.type)}
          </LongText>
        </div>
      ),
      meta:
        index === 0
          ? {
              className:
                'sticky left-0 z-20 min-w-40 bg-background text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]',
              thClassName:
                'sticky left-0 z-30 min-w-40 bg-background text-center',
            }
          : undefined,
      enableSorting: true,
    })
  )

  return [
    {
      id: 'index',
      header: '#',
      cell: ({ row, table }) => (
        <div className='text-center tabular-nums'>
          {row.index +
            1 +
            table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize}
        </div>
      ),
      meta: {
        className: 'min-w-12 text-center',
        thClassName: 'min-w-12 text-center',
      },
      enableSorting: false,
      enableHiding: false,
    },
    ...registrationFields,
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Valor' />
      ),
      cell: ({ row }) => (
        <span className='whitespace-nowrap'>
          {formatPrice(row.original.price)}
        </span>
      ),
      meta: {
        className: 'min-w-32',
        thClassName: 'min-w-32',
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = row.original.status

        return (
          <div className='flex whitespace-nowrap'>
            <Badge
              variant='outline'
              className={cn('capitalize', statusColors[status])}
            >
              {statusLabels[status]}
            </Badge>
          </div>
        )
      },
      meta: {
        className: 'min-w-36',
        thClassName: 'min-w-36',
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableHiding: false,
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: DataTableRowActions,
      meta: {
        className: 'min-w-16 text-center',
        thClassName: 'min-w-16',
      },
    },
  ]
}
