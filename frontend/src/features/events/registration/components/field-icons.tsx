import { CalendarDays, List, Mail, Phone, Type } from 'lucide-react'
import type { RegistrationFieldType } from '@/features/events/registration/types/registration'

interface FieldIconProps {
  type: RegistrationFieldType
}

export function FieldIcon({ type }: FieldIconProps) {
  const props = {
    className: 'size-4 shrink-0 text-muted-foreground',
  }

  switch (type) {
    case 'email':
      return <Mail {...props} />

    case 'phone':
      return <Phone {...props} />

    case 'date':
      return <CalendarDays {...props} />

    case 'select':
      return <List {...props} />

    default:
      return <Type {...props} />
  }
}
