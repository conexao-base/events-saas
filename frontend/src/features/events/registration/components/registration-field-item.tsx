import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { RegistrationField } from '@/features/events/registration/types/registration'
import { useRegistrationField } from '../hooks/use-registration-field-item'
import { FieldIcon } from './field-icons'
import { RegistrationFieldOptions } from './registration-field-options'
import { RegistrationFieldTypeSelect } from './registration-field-type-select'

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
    saveLabel,
    toggleEditing,
    changeType,
    options,
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

  const editProps = {
    id: field.id,
    value: field.type,
    label,
    required: field.required,
    onRequiredChange: toggleRequired,
    onChange: changeType,
    onEdit: toggleEditing,
    onDelete: deleteField,
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`min-w-0 rounded-lg border bg-background p-3 sm:p-4 ${
        isDragging ? 'z-10 opacity-70 shadow-md' : ''
      }`}
    >
      {/* Nome e controles na mesma linha */}
      <div className='flex min-w-0 flex-col gap-3 md:flex-row md:items-center'>
        <div className='flex min-w-0 flex-1 items-center gap-2'>
          <Button
            ref={setActivatorNodeRef}
            type='button'
            variant='ghost'
            size='icon'
            className='size-8 shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing'
            aria-label={`Reordenar ${field.label}, posição ${index + 1}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className='size-4' />
          </Button>

          <FieldIcon type={field.type} />

          {editing ? (
            <div className='flex min-w-0 flex-1 items-center gap-1'>
              <Input
                autoFocus
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') saveLabel()
                }}
                className='h-8 min-w-0'
                aria-label='Nome do campo'
              />

              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-8 shrink-0 text-primary'
                onClick={saveLabel}
                aria-label='Salvar nome'
              >
                <Check className='size-4' />
              </Button>
            </div>
          ) : (
            <span className='min-w-0 truncate text-sm font-medium'>
              {field.label}
            </span>
          )}
        </div>

        <div className='min-w-0 md:shrink-0'>
          <RegistrationFieldTypeSelect {...editProps} />
        </div>
      </div>

      {/* Opções abaixo da linha de controles */}
      {field.type === 'select' && (
        <div className='mt-3'>
          <RegistrationFieldOptions
            options={options}
            updateOption={updateOption}
            addOption={addOption}
            removeOption={removeOption}
          />
        </div>
      )}
    </div>
  )
}
