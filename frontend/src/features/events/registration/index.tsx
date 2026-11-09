import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field-error'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { completeStep } from '../event-form-steps'
import { useEventFormValidation } from '../event-form-validation-provider'
import { RegistrationFieldList } from './components/registration-field-list'
import { RegistrationHeader } from './components/registration-header'
import { useRegistration } from './components/registration-provider'

type RegistrationProps = {
  eventId?: string
}

function RegistrationContent({ eventId }: RegistrationProps) {
  const navigate = useNavigate()
  const { addField, fields } = useRegistration()
  const { validateRegistration, errors } = useEventFormValidation()

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
    if (fields.length === 0) {
      validateRegistration({ fields })
      return
    }

    if (!validateRegistration({ fields })) return

    completeStep('registration')

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
    <Main className='mb-10 flex flex-1 flex-col gap-6 md:px-6 lg:px-8 xl:px-10'>
      <h1 className='text-center text-3xl font-bold tracking-tight md:text-left'>
        {eventId ? 'Editar Evento' : 'Criar Evento'}
      </h1>

      <Card className='md:p-2 lg:p-3 xl:p-4'>
        <CardHeader className='mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <RegistrationHeader />

          <Button
            type='button'
            onClick={addField}
            className='hidden sm:flex sm:w-auto'
          >
            <Plus className='mr-2 size-4' />
            Adicionar campo
          </Button>
        </CardHeader>

        <CardContent>
          <RegistrationFieldList />

          <div className='mt-3 text-center sm:text-right'>
            <FieldError error={errors['registration.fields']} />
          </div>

          <Button
            type='button'
            onClick={addField}
            className='mt-4 w-full sm:hidden'
          >
            <Plus className='mr-2 size-4' />
            Adicionar campo
          </Button>
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
