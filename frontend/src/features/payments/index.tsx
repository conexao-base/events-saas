import { Route } from '@/routes/_authenticated/events/$eventId/payments'
import { Settings2, Ticket } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PaymentLots } from './components/lots/payment-lots'
import { PaymentSettings } from './components/payment-settings'
import { PaymentsProvider } from './payments-provider'

export function Payments() {
  const { eventId } = Route.useParams()

  return (
    <PaymentsProvider eventId={eventId}>
      <Header>
        <Search className='ms-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
      </Header>

      <Main className='mb-10 flex flex-1 flex-col gap-6 md:px-6 lg:px-8 xl:px-10'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight'>Pagamentos</h1>
          <p className='text-muted-foreground'>
            Gerencie os lotes, valores e condições de pagamento do evento.
          </p>
        </div>

        <Tabs defaultValue='lots' className='space-y-6'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='lots'>
                <Ticket className='mr-2 size-4' />
                Lotes e condições
              </TabsTrigger>

              <TabsTrigger value='settings'>
                <Settings2 className='mr-2 size-4' />
                Configurações
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='lots' className='space-y-6'>
            <PaymentLots />
          </TabsContent>

          <TabsContent value='settings'>
            <PaymentSettings />
          </TabsContent>
        </Tabs>
      </Main>
    </PaymentsProvider>
  )
}
