import type { UseFormReturn } from 'react-hook-form'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { DatePickerField } from '@/features/events/event-builder/info/components/date-picker-field'
import type { PaymentLotFormData } from './payment-lot-form.types'

interface PaymentLotFieldsProps {
  form: UseFormReturn<PaymentLotFormData>
}

export function PaymentLotFields({ form }: PaymentLotFieldsProps) {
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='font-medium'>Informações do lote</h3>
        <p className='text-sm text-muted-foreground'>
          Defina o nome, valor, período e disponibilidade do lote.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do lote</FormLabel>
              <FormControl>
                <Input placeholder='Ex: Primeiro lote' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='value'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  placeholder='R$ 0,00'
                  value={field.value}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '')
                    field.onChange(formatCurrency(digits))
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid w-full grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='startDate'
          render={({ field }) => (
            <FormItem className='w-full min-w-0 space-y-2'>
              <FormControl>
                <DatePickerField
                  id='startDate'
                  label='Data inicial'
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='endDate'
          render={({ field }) => (
            <FormItem className='w-full min-w-0 space-y-2'>
              <FormControl>
                <DatePickerField
                  id='endDate'
                  label='Data final'
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid gap-4 md:grid-cols-2 md:items-end'>
        <FormField
          control={form.control}
          name='capacity'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de vagas</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={1}
                  placeholder='Ilimitado'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='active'
          render={({ field }) => (
            <FormItem className='flex h-10 items-center justify-between rounded-md border px-3'>
              <FormLabel>Lote ativo</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
