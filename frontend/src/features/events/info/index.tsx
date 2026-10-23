import { useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useInfoForm } from '../hooks/use-info-form'
import { InfoBasicForm } from './components/info-basic-form'
import { InfoHeader } from './components/info-header'

type InfoProps = {
  eventId?: string
}

function InfoContent({ eventId }: InfoProps) {
  const navigate = useNavigate()
  const { isLoading } = useInfoForm(eventId)

  function handleNext() {
    if (eventId) {
      navigate({
        to: '/events/$eventId/registration',
        params: { eventId },
      })
      return
    }

    navigate({ to: '/events/new/registration' })
  }

  if (eventId && isLoading) {
    return (
      <Main className='mb-10 flex flex-1 flex-col gap-6'>
        <p className='text-sm text-muted-foreground'>
          Carregando dados do evento...
        </p>
      </Main>
    )
  }

  return (
    <Main className='mb-10 flex flex-1 flex-col gap-6'>
      <h1 className='text-2xl font-bold tracking-tight'>
        {eventId ? 'Editar Evento' : 'Criar Evento'}
      </h1>

      <Card>
        <CardHeader>
          <InfoHeader />
        </CardHeader>

        <CardContent>
          <InfoBasicForm />
        </CardContent>

        <CardFooter className='justify-end border-t px-6 py-4'>
          <Button type='button' onClick={handleNext}>
            Avançar
            <ChevronRight className='ml-2 size-4' />
          </Button>
        </CardFooter>
      </Card>
    </Main>
  )
}

export function Info({ eventId }: InfoProps) {
  return (
    <>
      <Header fixed>
        <Search className='ms-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <InfoContent eventId={eventId} />
    </>
  )
}
