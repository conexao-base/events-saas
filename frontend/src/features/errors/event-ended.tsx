import { useNavigate } from '@tanstack/react-router'
import { CalendarX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EventEndedProps {
  eventName?: string
}

export function EventEnded({ eventName }: EventEndedProps) {
  const navigate = useNavigate()

  return (
    <div className='flex flex-1 items-center justify-center px-6 py-12'>
      <div className='mx-auto flex w-full max-w-md flex-col items-center gap-3 text-center'>
        <div className='mb-2 flex size-20 items-center justify-center rounded-full bg-muted'>
          <CalendarX className='size-10 text-muted-foreground' />
        </div>

        <h1 className='text-3xl font-bold tracking-tight'>
          Inscrições encerradas
        </h1>

        <span className='font-medium'>
          O prazo para participar deste evento chegou ao fim.
        </span>

        <p className='text-sm leading-relaxed text-muted-foreground'>
          {eventName
            ? `As inscrições para ${eventName} não estão mais disponíveis.`
            : 'Este evento não está mais recebendo inscrições.'}{' '}
          Agradecemos pelo seu interesse!
        </p>
      </div>
    </div>
  )
}
