import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type LoadingProps = {
  className?: string
  text?: string
}

export function Loading({ className, text = 'Carregando...' }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
    >
      <Loader2 className='size-8 animate-spin text-primary' />
      <span className='text-sm text-muted-foreground'>{text}</span>
    </div>
  )
}
