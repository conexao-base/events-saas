import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { registrationService } from '@/services/registration.service'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RegistrationsTable } from './components/registrations-table'

const route = getRouteApi('/_authenticated/registrations/')

export function Registrations() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const {
    data: registrations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['registrations'],
    queryFn: registrationService.getAll,
  })

  return (
    <>
      <Header fixed>
        <Search className='ms-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <Main className='mb-10 flex flex-1 flex-col gap-6 md:px-6 lg:px-8 xl:px-10'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>
            Inscrições Gerais
          </h2>
          <p className='text-sm text-muted-foreground'>
            Visualize todas as inscrições realizadas nos seus eventos.
          </p>
        </div>

        {!isLoading && !isError && (
          <p className='text-1xl font-bold text-muted-foreground'>
            Total de {registrations.length} inscrições
          </p>
        )}

        {isLoading ? (
          <p>Carregando inscrições...</p>
        ) : isError ? (
          <p>Erro ao carregar inscrições.</p>
        ) : (
          <RegistrationsTable
            data={registrations}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>
    </>
  )
}
