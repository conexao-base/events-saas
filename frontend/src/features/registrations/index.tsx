import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { eventService } from '@/services/event.service'
import { registrationService } from '@/services/registration.service'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RegistrationsDialogs } from './components/registrations-dialogs'
import { RegistrationsProvider } from './components/registrations-provider'
import { RegistrationsTable } from './components/registrations-table'
import { RegistrationsPrimaryButtons } from './components/registratons-primary-buttons'

const route = getRouteApi('/_authenticated/events/$eventId/registrations/')

export function Registrations() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { eventId } = route.useParams()

  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.findById(eventId),
  })

  const { data: registrations = [] } = useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => registrationService.getByEvent(eventId),
  })

  return (
    <RegistrationsProvider>
      <Header fixed>
        <Search className='ms-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <Main className='mb-10 flex flex-1 flex-col gap-6 md:px-6 lg:px-8 xl:px-10'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-center text-3xl font-bold tracking-tight md:text-left'>
                Inscrições
              </h2>

              {event?.name && (
                <p className='mt-2 text-center text-3xl tracking-tight text-muted-foreground md:text-left'>
                  {event.name}
                </p>
              )}

              <p className='text-sm text-muted-foreground'>
                Gerencie os participantes inscritos neste evento.
              </p>
            </div>
          </div>

          <RegistrationsPrimaryButtons />
        </div>

        <RegistrationsTable
          data={registrations}
          registrationFields={event?.registration_fields ?? []}
          search={search}
          navigate={navigate}
        />
      </Main>

      <RegistrationsDialogs
        eventId={eventId}
        eventPrice={String(event?.price ?? '0')}
        registrationFields={event?.registration_fields ?? []}
      />
    </RegistrationsProvider>
  )
}
