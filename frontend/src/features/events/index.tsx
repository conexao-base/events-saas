import { useNavigate } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { EventsCard } from './components/events-card'
import { EventsPrimaryButtons } from './components/events-primary-button'
import { EventsProvider } from './components/events-provider'
import { useEvents } from './hooks/use-events'

export function Events() {
  const { events, isLoading } = useEvents()
  const navigate = useNavigate()

  return (
    <EventsProvider>
      <Header fixed>
        <Search className='ms-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <Main className='mb-10 flex flex-1 flex-col gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Eventos</h2>
            <p className='text-muted-foreground'>
              Gerencie seus eventos e acompanhe as inscrições.
            </p>
          </div>

          <EventsPrimaryButtons />
        </div>

        <div className='-mb-2 flex items-center justify-between gap-3'>
          <p className='text-sm font-medium text-foreground'>
            {isLoading ? 'Carregando eventos...' : `${events.length} eventos`}
          </p>
        </div>

        {!isLoading && events.length === 0 && (
          <div className='rounded-lg border border-dashed p-8 text-center'>
            <h3 className='font-semibold'>Nenhum evento cadastrado</h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              Crie seu primeiro evento para começar.
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {events.map((event) => (
            <EventsCard
              key={event.id}
              event={event}
              onClick={() =>
                navigate({
                  to: '/events/$eventId/info',
                  params: { eventId: event.id },
                })
              }
            />
          ))}
        </div>
      </Main>
    </EventsProvider>
  )
}
