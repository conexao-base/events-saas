import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
        <div className='space-y-2'>
          <Label htmlFor='startDate'>Data de início</Label>
          <Input
            id='startDate'
            type='date'
            value={formData.startDate}
            onChange={(event) => updateField('startDate', event.target.value)}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='endDate'>Data de término</Label>
          <Input
            id='endDate'
            type='date'
            value={formData.endDate}
            onChange={(event) => updateField('endDate', event.target.value)}
            min={formData.startDate || undefined}
            required
          />
        </div>
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
        <Label htmlFor='description'>Descrição</Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder='Conte um pouco sobre o evento, o objetivo e o público alvo..'
          rows={6}
          className='min-h-36 resize-y'
        />
      </div>
    </div>
  )
}
