import { Link } from '@tanstack/react-router'
import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { clearEventFormDraft } from '@/features/events/event-builder/event-form-storage'

export function EventsPrimaryButtons() {
  const handleCreateEvent = () => {
    clearEventFormDraft()
  }

  return (
    <Button asChild className='space-x-1'>
      <Link
        to='/events/new/info'
        onClick={handleCreateEvent}
      >
        <span>Criar Evento</span>
        <CalendarPlus size={18} />
      </Link>
    </Button>
  )
}