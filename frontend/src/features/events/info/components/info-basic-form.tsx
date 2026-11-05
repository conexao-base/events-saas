import { parseDateInput } from '@/utils/parseDateInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePickerField } from './date-picker-field'
import { useInfo } from './info-provider'

export function InfoBasicForm() {
  const { formData, setFormData } = useInfo()

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Nome do evento</Label>
        <Input
          id='name'
          value={formData.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder='Ex.: Retiro de Jovens'
          required
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <DatePickerField
          id='startDate'
          label='Data de início'
          value={formData.startDate}
          onChange={(value) => updateField('startDate', value)}
        />

        <DatePickerField
          id='endDate'
          label='Data de término'
          value={formData.endDate}
          onChange={(value) => updateField('endDate', value)}
          minDate={parseDateInput(formData.startDate)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='location'>Local do evento</Label>
        <Input
          id='location'
          value={formData.location}
          onChange={(event) => updateField('location', event.target.value)}
          placeholder='Ex.: Sítio Recanto da Paz'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Informações Gerais</Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder='Fique livre para falar sobre o evento, o objetivo, prazos e o público alvo..'
          rows={6}
          className='min-h-36 resize-y'
        />
      </div>
    </div>
  )
}
