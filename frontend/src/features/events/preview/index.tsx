import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { usePublishEvent } from '../hooks/use-publish-event'
import { useInfo } from '../info/components/info-provider'
import { useRegistration } from '../registration/components/registration-provider'
import { EventAppearanceForm } from './components/event-appearance-form'
import { EventPreviewForm } from './components/event-preview-form'
import { usePreview } from './components/preview-provider'

type PreviewProps = {
  eventId?: string
}

export function Preview({ eventId }: PreviewProps) {
  const navigate = useNavigate()
  const { formData } = useInfo()
  const { fields } = useRegistration()
  const { appearance } = usePreview()
  const { isSaving, publishEvent } = usePublishEvent({ eventId })

  function handleBack() {
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
    <>
      <Header fixed>
        <Search className='ms-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <Main className='mb-10 flex flex-1 flex-col gap-6 md:px-6 lg:px-8 xl:px-10'>
         <h1 className='text-center text-3xl font-bold tracking-tight md:text-left'>
          {eventId ? 'Editar Evento' : 'Criar Evento'}
        </h1>

        <Card className='md:p-2 lg:p-3 xl:p-4'>
          <CardHeader className='mt-2'>
            <div className='space-y-1'>
              <h2 className='text-lg font-semibold tracking-tight'>
                Visualização do Formulário
              </h2>
              <p className='text-sm text-muted-foreground'>
                Confira como a página de inscrição ficará para os participantes
                e personalize sua aparência.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className='grid min-w-0 grid-cols-1 items-stretch gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)] xl:gap-0'>
              <section className='min-w-0 xl:pr-8'>
                <EventPreviewForm />
              </section>

              <section className='min-w-0 border-t pt-6 xl:my-0 xl:self-stretch xl:border-t-0 xl:border-l xl:pt-0 xl:pl-8'>
                <EventAppearanceForm />
              </section>
            </div>
          </CardContent>

          <CardFooter className='flex justify-between gap-3 border-t px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              disabled={isSaving}
              onClick={handleBack}
            >
              <ArrowLeft className='mr-2 size-4' />
              Voltar
            </Button>

            <Button
              type='button'
              disabled={isSaving || !formData.name.trim()}
              onClick={() =>
                publishEvent({
                  formData,
                  fields,
                  appearance,
                })
              }
            >
              {isSaving
                ? 'Salvando...'
                : eventId
                  ? 'Salvar alterações'
                  : 'Criar evento'}
              <ArrowRight className='ml-2 size-4' />
            </Button>
          </CardFooter>
        </Card>
      </Main>
    </>
  )
}
