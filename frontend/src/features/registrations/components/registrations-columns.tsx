import { type ColumnDef } from '@tanstack/react-table'
import type { ApiRegistration } from '@/services/registration.service'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'

const statusLabels = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
}

const statusColors = {
  pending: 'border-yellow-500/50 text-yellow-600',
  confirmed: 'border-green-500/50 text-green-600',
  cancelled: 'border-red-500/50 text-red-600',
}

function formatPrice(price: string) {
  if (!price || Number(price) === 0) return 'Gratuito'

  return Number(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function createRegistrationsColumns(): ColumnDef<ApiRegistration>[] {
  return [
    {
      accessorKey: 'event_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='#' />
      ),
      cell: ({ row }) => (
        <Link
          to='/events/$eventId/registrations'
          params={{ eventId: row.original.event_id }}
          className='font-mono text-xs hover:text-primary hover:underline'
        >
          {row.original.event_id}
        </Link>
      ),
    },
    {
      accessorKey: 'event_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Evento' />
      ),
      cell: ({ row }) => row.original.event_name || '-',
    },
    {
      id: 'name',
      accessorFn: (row) => row.data['full-name'],
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nome' />
      ),
      cell: ({ row }) => row.original.data['full-name'] || '-',
    },
    {
      id: 'cpf',
      accessorFn: (row) => row.data.cpf,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CPF' />
      ),
      cell: ({ row }) => row.original.data.cpf || '-',
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Valor' />
      ),
      cell: ({ row }) => formatPrice(row.original.price),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = row.original.status

        return (
          <Badge variant='outline' className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        )
      },
    },
  ]
}
