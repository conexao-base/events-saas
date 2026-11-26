import type { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PaymentMethodSelector } from '../../shared/payment-method-selector'
import type { PaymentLotFormData } from '../lots/payment-lot-form.types'

interface PaymentRuleFieldsProps {
  form: UseFormReturn<PaymentLotFormData>
}

export function PaymentRuleFields({ form }: PaymentRuleFieldsProps) {
  const billingTypes = form.watch('billingTypes')

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='font-medium'>Condições de pagamento</h3>
        <p className='text-sm text-muted-foreground'>
          Selecione as formas de pagamento disponíveis neste lote.
        </p>
      </div>

      <FormField
        control={form.control}
        name='billingTypes'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <PaymentMethodSelector
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {billingTypes.includes('CREDIT_CARD') && (
        <FormField
          control={form.control}
          name='maxInstallments'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Máximo de parcelas</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={1}
                  max={12}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
