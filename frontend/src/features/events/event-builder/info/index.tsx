import { useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { completeStep } from '@/features/events/event-builder/event-form-steps'
import { useEventFormValidation } from '@/features/events/event-builder/event-form-validation-provider'
import { InfoBasicForm } from '@/features/events/event-builder/info/components/info-basic-form'
import { InfoHeader } from '@/features/events/event-builder/info/components/info-header'
import { useInfo } from '@/features/events/event-builder/info/components/info-provider'
import { useInfoForm } from '@/features/events/hooks/use-info-form'

type InfoProps = {
  eventId?: string
}

function InfoContent({ eventId }: InfoProps) {
  const navigate = useNavigate()
  const { isLoading } = useInfoForm(eventId)
  const { formData } = useInfo()
  const { validateInfo } = useEventFormValidation()

  function handleNext() {
    if (!validateInfo(formData)) return

    completeStep('info')

    if (eventId) {
      navigate({
        to: '/events/$eventId/registration',
        params: { eventId },
      })
      return
    }

    navigate({ to: '/events/new/registration' })
  }

  return (
    <Main
      loading={!!eventId && isLoading}
      className='mb-10 flex flex-1 flex-col gap-6 md:px-6 lg:px-8 xl:px-10'
    >
      <h1 className='text-center text-3xl font-bold tracking-tight md:text-left'>
        {eventId ? 'Editar Evento' : 'Criar Evento'}
      </h1>

      <Card className='md:p-2 lg:p-3 xl:p-4'>
        <CardHeader className='mt-2'>
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
