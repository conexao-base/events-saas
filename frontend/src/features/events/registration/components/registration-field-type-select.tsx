import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { RegistrationFieldType } from '@/features/events/registration/types/registration'
import { fieldTypes } from '../data/field-types'

type RegistrationFieldTypeSelectProps = {
  id: string
  value: RegistrationFieldType
  label: string
  required: boolean
  onRequiredChange: (checked: boolean) => void
  onChange: (type: RegistrationFieldType) => void
  onEdit: () => void
  onDelete: () => void
}

export function RegistrationFieldTypeSelect({
  id,
  value,
  label,
  required,
  onRequiredChange,
  onChange,
  onEdit,
  onDelete,
}: RegistrationFieldTypeSelectProps) {
  return (
    <div className='flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:flex-nowrap'>
      <select
        aria-label={`Tipo do campo ${label}`}
        value={value}
        onChange={(event) =>
          onChange(event.target.value as RegistrationFieldType)
        }
        className='h-8 w-40 min-w-0 shrink-0 cursor-pointer rounded-md border border-input bg-background px-2 text-xs font-medium transition-colors outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring'
      >
        {fieldTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <div className='flex h-8 w-[130px] shrink-0 items-center justify-between gap-2 rounded-md border bg-muted/30 px-2'>
        <Switch
          id={`required-${id}`}
          checked={required}
          onCheckedChange={onRequiredChange}
          className='shrink-0'
        />

        <label
          htmlFor={`required-${id}`}
          className='cursor-pointer text-xs font-medium whitespace-nowrap text-muted-foreground'
        >
          {required ? 'Obrigatório' : 'Opcional'}
        </label>
      </div>

      <div className='ml-auto flex h-8 w-[68px] shrink-0 items-center justify-end gap-0.5'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground'
          onClick={onEdit}
          aria-label={`Editar ${label}`}
          title='Editar nome'
        >
          <Pencil className='size-3.5' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
          onClick={onDelete}
          aria-label={`Excluir ${label}`}
          title='Excluir campo'
        >
          <Trash2 className='size-3.5' />
        </Button>
      </div>
    </div>
  )
}
