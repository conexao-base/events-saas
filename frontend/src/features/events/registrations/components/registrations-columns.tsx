import { type ColumnDef } from '@tanstack/react-table'
import {
  type ApiRegistration,
  type RegistrationStatus,
} from '@/services/registration.service'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
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

function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === '') {
    return 'Gratuito'
  }

  const value = Number(price)

  if (Number.isNaN(value) || value === 0) {
    return 'Gratuito'
  }

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function createRegistrationsColumns(): ColumnDef<ApiRegistration>[] {
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
    {
      id: 'name',
      accessorFn: (row) => row.data['full-name'],
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nome' />
      ),
      cell: ({ row }) => (
        <span className='whitespace-nowrap'>
          {row.original.data['full-name'] || '-'}
        </span>
      ),
      meta: {
        className:
          'sticky left-0 z-20 min-w-40 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]',
        thClassName: 'sticky left-0 z-30 min-w-40 bg-background',
      },
      enableSorting: true,
    },
    {
      id: 'cpf',
      accessorFn: (row) => row.data.cpf,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CPF' />
      ),
      cell: ({ row }) => (
        <span className='whitespace-nowrap'>
          {row.original.data.cpf || '-'}
        </span>
      ),
      meta: {
        className: 'min-w-36',
        thClassName: 'min-w-36',
      },
      enableSorting: true,
    },
    {
      id: 'email',
      accessorFn: (row) => row.data.email,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='E-mail' />
      ),
      cell: ({ row }) => (
        <span className='whitespace-nowrap'>
          {row.original.data.email || '-'}
        </span>
      ),
      meta: {
        className: 'min-w-52',
        thClassName: 'min-w-52',
      },
      enableSorting: true,
    },
    {
      accessorKey: 'payment_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Valor' />
      ),
      cell: ({ row }) => (
        <span className='whitespace-nowrap'>
          {formatPrice(row.original.payment_amount)}
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
