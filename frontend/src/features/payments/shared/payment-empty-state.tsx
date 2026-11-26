import type { LucideIcon } from 'lucide-react'

interface PaymentEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function PaymentEmptyState({
  icon: Icon,
  title,
  description,
}: PaymentEmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
      <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
        <Icon className='size-6 text-muted-foreground' />
      </div>

      <div className='space-y-1'>
        <h3 className='font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
    </div>
  )
}
