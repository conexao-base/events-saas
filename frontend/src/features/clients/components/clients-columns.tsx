import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes } from '../data/data'
import { type Client } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const clientsColumns: ColumnDef<Client>[] = [
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nome' />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      const fullName = `${firstName} ${lastName}`

      return <LongText className='max-w-40'>{fullName}</LongText>
    },
    meta: {
      className:
        'sticky left-0 z-20 min-w-40 w-40 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)] md:static md:shadow-none',
      thClassName: 'sticky left-0 z-30 min-w-40 w-40 bg-background md:static',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='E-mail' />
    ),
    cell: ({ row }) => (
      <div className='min-w-52 whitespace-nowrap'>{row.getValue('email')}</div>
    ),
    meta: {
      className: 'min-w-56',
      thClassName: 'min-w-56',
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Telefone' />
    ),
    cell: ({ row }) => (
      <div className='min-w-36 whitespace-nowrap'>
        {row.getValue('phoneNumber')}
      </div>
    ),
    meta: {
      className: 'min-w-40',
      thClassName: 'min-w-40',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status do Pagamento' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const badgeColor = callTypes.get(status)

      const statusLabels: Record<Client['status'], string> = {
        paid: 'Pago',
        pending: 'Pendente',
        cancelled: 'Cancelado',
        refunded: 'Reembolsado',
      }

      return (
        <div className='flex whitespace-nowrap'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {statusLabels[status]}
          </Badge>
        </div>
      )
    },
    meta: {
      className: 'min-w-44',
      thClassName: 'min-w-44',
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Valor' />
    ),
    cell: ({ row }) => (
      <div className='min-w-32 text-sm font-medium whitespace-nowrap'>
        {row.original.amount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </div>
    ),
    meta: {
      className: 'min-w-36',
      thClassName: 'min-w-36',
    },
    enableSorting: true,
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
