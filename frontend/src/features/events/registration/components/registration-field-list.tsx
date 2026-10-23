import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { RegistrationFieldItem } from './registration-field-item'
import { useRegistration } from './registration-provider'

export function RegistrationFieldList() {
  const { fields, reorderFields } = useRegistration()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    reorderFields(String(active.id), String(over.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={fields.map((field) => field.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='space-y-2'>
          {fields.map((field, index) => (
            <RegistrationFieldItem key={field.id} field={field} index={index} />
          ))}

          {fields.length === 0 && (
            <div className='rounded-lg border border-dashed py-10 text-center'>
              <p className='text-sm text-muted-foreground'>
                Nenhum campo adicionado.
              </p>

              <p className='mt-1 text-xs text-muted-foreground'>
                Use o botão acima para adicionar campos ao formulário.
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
