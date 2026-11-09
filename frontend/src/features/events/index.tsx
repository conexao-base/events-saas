import { useNavigate } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { EventCardWithActions } from './components/event-card-with-actions'
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

      <Main className='mb-10 flex flex-1 flex-col gap-6 md:px-6 lg:px-8 xl:px-10'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h1 className='text-center text-3xl font-bold tracking-tight md:text-left'>
              Eventos
            </h1>
            <p className='text-center text-muted-foreground md:text-left'>
              Organize seus eventos e acompanhe as inscrições.
            </p>
          </div>

          <div className='mt-auto flex w-full justify-end md:mt-0 md:w-auto'>
            <EventsPrimaryButtons />
          </div>
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
            <EventCardWithActions
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
