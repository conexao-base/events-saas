import { useState } from 'react'
import type {
  RegistrationField,
  RegistrationFieldType,
} from '@/features/events/event-builder/registration/types/registration'
import { useRegistration } from '../components/registration-provider'

interface UseRegistrationFieldProps {
  field: RegistrationField
}

export function useRegistrationField({ field }: UseRegistrationFieldProps) {
  const { updateField, removeField } = useRegistration()

  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(field.label)

  const options = field.options ?? []

  function saveLabel() {
    const trimmedLabel = label.trim()

    if (!trimmedLabel) return

    updateField(field.id, { label: trimmedLabel })
    setEditing(false)
  }

  function cancelEditing() {
    setLabel(field.label)
    setEditing(false)
  }

  function toggleEditing() {
    if (editing) {
      cancelEditing()
      return
    }

    setLabel(field.label)
    setEditing(true)
  }

  function changeType(type: RegistrationFieldType) {
    updateField(field.id, {
      type,
      ...(type === 'select' && options.length === 0
        ? { options: ['Opção 1', 'Opção 2'] }
        : {}),
    })
  }

  function updateOption(index: number, value: string) {
    const updatedOptions = [...options]
    updatedOptions[index] = value

    updateField(field.id, { options: updatedOptions })
  }

  function addOption() {
    const updatedOptions = [...options, `Opção ${options.length + 1}`]

    updateField(field.id, { options: updatedOptions })
  }

  function removeOption(index: number) {
    if (options.length <= 1) return

    const updatedOptions = options.filter(
      (_, optionIndex) => optionIndex !== index
    )

    updateField(field.id, { options: updatedOptions })
  }

  function toggleRequired(required: boolean) {
    updateField(field.id, { required })
  }

  function deleteField() {
    removeField(field.id)
  }

  return {
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
  }
}
