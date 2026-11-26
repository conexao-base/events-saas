import { Checkbox } from '@/components/ui/checkbox'
import type { BillingType } from '../payments.types'
import { billingOptions } from './payment-method-labels'

interface PaymentMethodSelectorProps {
  value: BillingType[]
  onChange: (value: BillingType[]) => void
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  function toggle(type: BillingType, checked: boolean) {
    onChange(
      checked
        ? [...value, type]
        : value.filter((item) => item !== type)
    )
  }

  return (
    <div className='grid gap-3 sm:grid-cols-3'>
      {billingOptions.map((option) => (
        <label
          key={option.value}
          className='flex cursor-pointer items-center gap-2 rounded-lg border p-3'
        >
          <Checkbox
            checked={value.includes(option.value)}
            onCheckedChange={(checked) =>
              toggle(option.value, checked === true)
            }
          />
          <span className='text-sm'>{option.label}</span>
        </label>
      ))}
    </div>
  )
}