import { formatCurrency } from '@/utils/formatCurrency'
import { parseDateInput } from '@/utils/parseDateInput'
import { FieldError } from '@/components/ui/field-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useEventFormValidation } from '../../event-form-validation-provider'
import { DatePickerField } from './date-picker-field'
import { useInfo } from './info-provider'

export function InfoBasicForm() {
  const { formData, setFormData } = useInfo()
  const { errors, clearError } = useEventFormValidation()

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    clearError(`info.${field}`)
  }

  function updatePrice(value: string) {
    updateField('price', formatCurrency(value))
  }

  return (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <Label htmlFor='name'>
          Nome do evento <span className='text-destructive'>*</span>
        </Label>

        <Input
          id='name'
          value={formData.name}
          onChange={(event) => updateField('name', event.target.value)}
          aria-invalid={!!errors['info.name']}
          required
        />

        <FieldError error={errors['info.name']} />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <DatePickerField
            id='startDate'
            label='Data de início'
            value={formData.startDate}
            onChange={(value) => updateField('startDate', value)}
            required
          />

          <FieldError error={errors['info.startDate']} />
        </div>

        <div className='space-y-2'>
          <DatePickerField
            id='endDate'
            label='Data de término'
            value={formData.endDate}
            onChange={(value) => updateField('endDate', value)}
            minDate={parseDateInput(formData.startDate)}
            required
          />

          <FieldError error={errors['info.endDate']} />
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='location'>
            Local do evento <span className='text-destructive'>*</span>
          </Label>

          <Input
            id='location'
            value={formData.location}
            onChange={(event) => updateField('location', event.target.value)}
            aria-invalid={!!errors['info.location']}
            required
          />

          <FieldError error={errors['info.location']} />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='price'>
            Valor (R$) <span className='text-destructive'>*</span>
          </Label>

          <Input
            id='price'
            type='text'
            inputMode='numeric'
            value={formatCurrency(formData.price)}
            onChange={(event) => updatePrice(event.target.value)}
            placeholder='R$ 0,00'
            className='tabular-nums'
            aria-invalid={!!errors['info.price']}
            required
          />

          <FieldError error={errors['info.price']} />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>
          Informações Gerais <span className='text-destructive'>*</span>
        </Label>

        <Textarea
          id='description'
          value={formData.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder='Descreva as principais informações sobre o evento...'
          rows={6}
          className='min-h-36 resize-y'
          aria-invalid={!!errors['info.description']}
          required
        />

        <FieldError error={errors['info.description']} />
      </div>
    </div>
  )
}
