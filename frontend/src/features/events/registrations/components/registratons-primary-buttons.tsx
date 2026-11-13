import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRegistrations } from './registrations-provider'

export function RegistrationsPrimaryButtons() {
  const { setOpen } = useRegistrations()

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Adicionar Inscrição</span>
        <UserPlus size={18} />
      </Button>
    </div>
  )
}
