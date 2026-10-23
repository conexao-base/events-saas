import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RegistrationFieldList } from './components/registration-field-list'
import { RegistrationHeader } from './components/registration-header'
import { useRegistration } from './components/registration-provider'

type RegistrationProps = {
  eventId?: string
}

function RegistrationContent({ eventId }: RegistrationProps) {
  const navigate = useNavigate()
  const { addField } = useRegistration()

  function handleBack() {
    if (eventId) {
      navigate({
        to: '/events/$eventId/info',
        params: { eventId },
      })
      return
    }

    navigate({ to: '/events/new/info' })
  }

  function handleNext() {
    if (eventId) {
      navigate({
        to: '/events/$eventId/preview',
        params: { eventId },
      })
      return
    }

    navigate({ to: '/events/new/preview' })
  }

  return (
    <Main className='flex flex-1 flex-col gap-6'>
      <h1 className='text-2xl font-bold tracking-tight'>
        {eventId ? 'Editar Evento' : 'Criar Evento'}
      </h1>

      <Card>
        <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <RegistrationHeader />

          <Button type='button' onClick={addField} className='w-full sm:w-auto'>
            <Plus className='mr-2 size-4' />
            Adicionar campo
          </Button>
        </CardHeader>

        <CardContent>
          <RegistrationFieldList />
        </CardContent>

        <CardFooter className='flex justify-between gap-3 border-t px-6 py-4'>
          <Button type='button' variant='outline' onClick={handleBack}>
            <ArrowLeft className='mr-2 size-4' />
            Voltar
          </Button>

          <Button type='button' onClick={handleNext}>
            Avançar
            <ArrowRight className='ml-2 size-4' />
          </Button>
        </CardFooter>
      </Card>
    </Main>
  )
}

export function Registration({ eventId }: RegistrationProps) {
  return (
    <>
      <Header fixed>
        <Search className='ms-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <RegistrationContent eventId={eventId} />
    </>
  )
}
