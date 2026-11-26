import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatCurrency } from '@/utils/formatCurrency'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import type { PaymentLot, PaymentLotPayload } from '../../payments.types'
import { PaymentRuleFields } from '../rules/payment-rule-fields'
import { PaymentLotFields } from './payment-lot-fields'
import type { PaymentLotFormData } from './payment-lot-form.types'

const paymentLotSchema = z.object({
  name: z.string().min(1, 'Informe o nome do lote'),
  value: z.string().min(1, 'Informe o valor do lote'),
  startDate: z.string().min(1, 'Informe a data inicial'),
  endDate: z.string().min(1, 'Informe a data final'),
  capacity: z.string(),
  active: z.boolean(),
  billingTypes: z
    .array(z.enum(['PIX', 'BOLETO', 'CREDIT_CARD']))
    .min(1, 'Selecione uma forma de pagamento'),
  maxInstallments: z.number().min(1).max(12),
})

interface PaymentLotFormProps {
  initialData?: PaymentLot
  onSubmit: (data: PaymentLotPayload) => void
  onCancel: () => void
}

export function PaymentLotForm({
  initialData,
  onSubmit,
  onCancel,
}: PaymentLotFormProps) {
  const form = useForm<PaymentLotFormData>({
    resolver: zodResolver(paymentLotSchema),
    defaultValues: {
      name: '',
      value: '',
      startDate: '',
      endDate: '',
      capacity: '',
      active: true,
      billingTypes: ['PIX'],
      maxInstallments: 1,
    },
  })

  useEffect(() => {
    form.reset({
      name: initialData?.name ?? '',
      value: initialData
        ? formatCurrency(String(Math.round(initialData.value * 100)))
        : '',
      startDate: initialData?.startDate?.slice(0, 10) ?? '',
      endDate: initialData?.endDate?.slice(0, 10) ?? '',
      capacity: initialData?.capacity?.toString() ?? '',
      active: initialData?.active ?? true,
      billingTypes: initialData?.billingTypes ?? ['PIX'],
      maxInstallments: initialData?.maxInstallments ?? 1,
    })
  }, [initialData, form])

  function handleSubmit(data: PaymentLotFormData) {
    const payload: PaymentLotPayload = {
      name: data.name.trim(),
      value: Number(data.value.replace(/\D/g, '')) / 100,
      startDate: data.startDate,
      endDate: data.endDate,
      capacity: data.capacity ? Number(data.capacity) : null,
      billingTypes: data.billingTypes,
      maxInstallments: data.billingTypes.includes('CREDIT_CARD')
        ? data.maxInstallments
        : 1,
      active: data.active,
      position: initialData?.position ?? 0,
    }

    onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='w-full max-w-none'
      >
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>{initialData ? 'Editar lote' : 'Novo lote'}</CardTitle>

            <CardDescription>
              Configure as informações e as condições de pagamento deste lote.
            </CardDescription>
          </CardHeader>

          <CardContent className='w-full space-y-6'>
            <PaymentLotFields form={form} />

            <div className='border-t pt-6'>
              <PaymentRuleFields form={form} />
            </div>

            <div className='flex justify-end gap-2 border-t pt-6'>
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancelar
              </Button>

              <Button type='submit'>
                {initialData ? 'Salvar alterações' : 'Criar lote'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
