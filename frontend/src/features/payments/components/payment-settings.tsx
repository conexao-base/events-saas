import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePayments } from '../payments-provider'

export function PaymentSettings() {
  const navigate = useNavigate()
  const { settings, saveAll, saving } = usePayments()

  const [enabled, setEnabled] = useState(false)
  const [dueDays, setDueDays] = useState(1)

  useEffect(() => {
    setEnabled(settings.enabled)
    setDueDays(settings.dueDays)
  }, [settings])

  async function handleSubmit() {
    try {
      await saveAll({ enabled, dueDays })

      await navigate({ to: '/events' })
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold'>Configurações gerais</h2>
        <p className='text-sm text-muted-foreground'>
          Gerencie as opções gerais de pagamento do evento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de pagamento</CardTitle>
          <CardDescription>
            Defina se os pagamentos estão habilitados e o prazo de vencimento
            das cobranças.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='space-y-6'>
            <div className='flex items-center justify-between rounded-lg border p-4'>
              <div className='space-y-1'>
                <Label htmlFor='payments-enabled'>Habilitar pagamentos</Label>
                <p className='text-sm text-muted-foreground'>
                  Permite que os participantes realizem pagamentos nas
                  inscrições.
                </p>
              </div>

              <Switch
                id='payments-enabled'
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>

            <div className='max-w-xs space-y-2'>
              <Label htmlFor='payment-due-days'>Prazo de vencimento</Label>
              <Input
                id='payment-due-days'
                type='number'
                min={1}
                value={dueDays}
                onChange={(event) => setDueDays(Number(event.target.value))}
              />
              <p className='text-xs text-muted-foreground'>
                Quantidade de dias até o vencimento da cobrança.
              </p>
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <Button onClick={handleSubmit} disabled={saving || dueDays < 1}>
              <Save className='mr-2 size-4' />
              {saving ? 'Salvando...' : 'Salvar configurações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
