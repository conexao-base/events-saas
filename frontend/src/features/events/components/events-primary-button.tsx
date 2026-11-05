import { Link } from '@tanstack/react-router'
import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EventsPrimaryButtons() {
  return (
    <Button asChild className='space-x-1'>
      <Link to='/events/new/info'>
        <span>Criar Evento</span>
        <CalendarPlus size={18} />
      </Link>
    </Button>
  )
}