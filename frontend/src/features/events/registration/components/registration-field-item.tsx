import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type {
  RegistrationField,
  RegistrationFieldType,
} from '@/features/events/registration/types/registration'
import { fieldTypes } from '../data/field-types'
import { useRegistrationField } from '../hooks/use-registration-field-item'
import { FieldIcon } from './field-icons'

type RegistrationFieldItemProps = {
  field: RegistrationField
  index: number
}

export function RegistrationFieldItem({
  field,
  index,
}: RegistrationFieldItemProps) {
  const {
    editing,
    label,
    setLabel,
    options,
    saveLabel,
    cancelEditing,
    toggleEditing,
    changeType,
    updateOption,
    addOption,
    removeOption,
    toggleRequired,
    deleteField,
  } = useRegistrationField({ field })

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`grid grid-cols-1 gap-3 rounded-lg border bg-background p-3 sm:grid-cols-[32px_minmax(0,1fr)_160px_130px_auto] sm:items-center ${
        isDragging ? 'z-10 opacity-70 shadow-md' : ''
      }`}
    >
      <Button
        ref={setActivatorNodeRef}
        type='button'
        variant='ghost'
        size='icon'
        className='hidden size-8 cursor-grab touch-none text-muted-foreground active:cursor-grabbing sm:flex'
        aria-label={`Reordenar ${field.label}, posição ${index + 1}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className='size-4' />
      </Button>

      <div className='flex min-w-0 items-center gap-3'>
        <FieldIcon type={field.type} />

        {editing ? (
          <div className='flex min-w-0 flex-1 items-center gap-1'>
            <Input
              autoFocus
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') saveLabel()
                if (event.key === 'Escape') cancelEditing()
              }}
              className='h-9'
              aria-label='Nome do campo'
            />

            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8 shrink-0'
              onClick={saveLabel}
              aria-label='Salvar nome'
            >
              <Check className='size-4' />
            </Button>

            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8 shrink-0'
              onClick={cancelEditing}
              aria-label='Cancelar edição'
            >
              <X className='size-4' />
            </Button>
          </div>
        ) : (
          <span className='truncate text-sm font-medium'>{field.label}</span>
        )}
      </div>

      <select
        aria-label={`Tipo do campo ${field.label}`}
        value={field.type}
        onChange={(event) =>
          changeType(event.target.value as RegistrationFieldType)
        }
        className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        {fieldTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {field.type === 'select' && (
        <div className='col-span-full space-y-2 rounded-md bg-muted/30 p-3 sm:col-span-full'>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-sm font-medium'>Opções de resposta</p>

            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addOption}
            >
              <Plus className='mr-1 size-3.5' />
              Adicionar opção
            </Button>
          </div>

          {options.map((option, optionIndex) => (
            <div
              key={`${field.id}-option-${optionIndex}`}
              className='flex items-center gap-2'
            >
              <Input
                value={option}
                onChange={(event) =>
                  updateOption(optionIndex, event.target.value)
                }
                placeholder={`Opção ${optionIndex + 1}`}
                aria-label={`Nome da opção ${optionIndex + 1}`}
                className='h-9'
              />

              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-8 shrink-0 text-muted-foreground hover:text-destructive'
                onClick={() => removeOption(optionIndex)}
                disabled={options.length <= 1}
                aria-label={`Excluir opção ${optionIndex + 1}`}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className='flex items-center gap-2'>
        <Switch
          id={`required-${field.id}`}
          checked={field.required}
          onCheckedChange={toggleRequired}
        />

        <label
          htmlFor={`required-${field.id}`}
          className='text-xs text-muted-foreground'
        >
          {field.required ? 'Obrigatório' : 'Opcional'}
        </label>
      </div>

      <div className='flex items-center justify-end gap-1'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8'
          onClick={toggleEditing}
          aria-label={`Editar ${field.label}`}
        >
          <Pencil className='size-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 text-muted-foreground hover:text-destructive'
          onClick={deleteField}
          aria-label={`Excluir ${field.label}`}
        >
          <Trash2 className='size-4' />
        </Button>
      </div>
    </div>
  )
}
