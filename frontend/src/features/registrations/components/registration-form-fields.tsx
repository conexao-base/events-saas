import { formatCurrency, parseCurrency } from '@/utils/formatCurrency'
import {
  formatRegistrationFieldValue,
  getRegistrationFieldMaxLength,
  getRegistrationFieldPlaceholder,
  getRegistrationInputType,
} from '@/utils/registration-field.utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CityInput } from '@/features/events/components/city-input'
import { DatePickerField } from '@/features/events/info/components/date-picker-field'
import { SelectDropdown } from '@/components/select-dropdown'
import type { RegistrationField } from '@/features/events/registration/types/registration'
import type { RegistrationFormMethods } from '../types/registration-form.types'

const statusOptions = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Confirmado', value: 'confirmed' },
  { label: 'Cancelado', value: 'cancelled' },
]

type RegistrationFieldsProps = {
  form: RegistrationFormMethods
  fields: RegistrationField[]
}

type RegistrationFieldProps = {
  form: RegistrationFormMethods
}

export function RegistrationFields({ form, fields }: RegistrationFieldsProps) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      {fields.map((field) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`answers.${field.id}`}
          render={({ field: inputField }) => (
            <FormItem>
              {field.type === 'date' ? (
                <DatePickerField
                  id={field.id}
                  label={field.label}
                  value={inputField.value ?? ''}
                  onChange={inputField.onChange}
                  required={field.required}
                />
              ) : (
                <>
                  <FormLabel>
                    {field.label}
                    {field.required && ' *'}
                  </FormLabel>

                  <FormControl>
                    {field.type === 'select' ? (
                      <SelectDropdown
                        defaultValue={inputField.value}
                        onValueChange={inputField.onChange}
                        placeholder='Selecione uma opção'
                        items={(field.options ?? []).map((option) => ({
                          label: option,
                          value: option,
                        }))}
                      />
                    ) : field.type === 'city' ? (
                      <CityInput
                        value={inputField.value ?? ''}
                        onChange={inputField.onChange}
                        placeholder={
                          getRegistrationFieldPlaceholder(field.type) ??
                          field.label
                        }
                      />
                    ) : (
                      <Input
                        {...inputField}
                        type={getRegistrationInputType(field.type)}
                        placeholder={
                          getRegistrationFieldPlaceholder(field.type) ??
                          field.label
                        }
                        maxLength={getRegistrationFieldMaxLength(field.type)}
                        onChange={(event) =>
                          inputField.onChange(
                            formatRegistrationFieldValue(
                              field.type,
                              event.target.value
                            )
                          )
                        }
                      />
                    )}
                  </FormControl>
                </>
              )}

              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}

export function RegistrationPriceField({ form }: RegistrationFieldProps) {
  return (
    <FormField
      control={form.control}
      name='price'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor da inscrição</FormLabel>

          <FormControl>
            <Input
              value={formatCurrency(field.value)}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '')
                const value = digits
                  ? parseCurrency(
                      (Number(digits) / 100).toFixed(2).replace('.', ',')
                    )
                  : null

                field.onChange(value === null ? '' : value.toFixed(2))
              }}
              inputMode='numeric'
              placeholder='0,00'
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RegistrationStatusField({ form }: RegistrationFieldProps) {
  return (
    <FormField
      control={form.control}
      name='status'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status da inscrição</FormLabel>

          <FormControl>
            <SelectDropdown
              defaultValue={field.value}
              onValueChange={field.onChange}
              placeholder='Selecione o status'
              items={statusOptions}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
