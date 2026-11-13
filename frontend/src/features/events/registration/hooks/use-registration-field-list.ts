import { useEffect, useState } from 'react'
import type { RegistrationField } from '@/features/events/registration/types/registration'
import { isDefaultField } from '../constants/default-fields'

type UseRegistrationFieldsProps = {
  initialFields: RegistrationField[]
}

export function useRegistrationFields({
  initialFields,
}: UseRegistrationFieldsProps) {
  const [fields, setFields] = useState<RegistrationField[]>(() =>
    cloneFields(initialFields)
  )

  useEffect(() => {
    setFields(cloneFields(initialFields))
  }, [initialFields])

  function addField() {
    setFields((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label: 'Novo campo',
        type: 'text',
        required: false,
      },
    ])
  }

  function updateField(id: string, changes: Partial<RegistrationField>) {
    if (isDefaultField(id)) return

    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, ...changes } : field
      )
    )
  }

  function removeField(id: string) {
    if (isDefaultField(id)) return

    setFields((current) => current.filter((field) => field.id !== id))
  }

  function reorderFields(activeId: string, overId: string) {
    setFields((current) => {
      const oldIndex = current.findIndex((field) => field.id === activeId)
      const newIndex = current.findIndex((field) => field.id === overId)

      if (oldIndex === -1 || newIndex === -1) {
        return current
      }

      if (isDefaultField(activeId) || isDefaultField(overId)) {
        return current
      }

      const reordered = [...current]
      const [movedField] = reordered.splice(oldIndex, 1)

      if (!movedField) return current

      reordered.splice(newIndex, 0, movedField)

      return reordered
    })
  }

  return {
    fields,
    addField,
    updateField,
    removeField,
    reorderFields,
  }
}

function cloneFields(fields: RegistrationField[]): RegistrationField[] {
  return fields.map((field) => ({
    ...field,
    options: field.options ? [...field.options] : undefined,
  }))
}
