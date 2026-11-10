import { createFileRoute } from '@tanstack/react-router'
import { Apps } from '@/features/apps'

type AppType = 'all' | 'connected' | 'notConnected'
type SortType = 'asc' | 'desc'

export const Route = createFileRoute('/_authenticated/apps/')({
  component: Apps,
  validateSearch: (search: Record<string, unknown>) => ({
    filter: typeof search.filter === 'string' ? search.filter : '',
    type: (search.type === 'connected' || search.type === 'notConnected'
      ? search.type
      : 'all') as AppType,
    sort: (search.sort === 'desc' ? 'desc' : 'asc') as SortType,
  }),
})
