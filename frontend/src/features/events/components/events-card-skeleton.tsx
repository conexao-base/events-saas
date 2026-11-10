import { Skeleton } from '@/components/ui/skeleton'

export function EventsCardSkeleton() {
  return (
    <article className='overflow-hidden rounded-xl border bg-card'>
      <div className='relative flex h-32 items-center justify-center bg-muted/40'>
        <Skeleton className='size-16 rounded-2xl' />
      </div>

      <div className='space-y-4 p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0 flex-1 space-y-2'>
            <Skeleton className='h-5 w-2/3' />
            <Skeleton className='h-4 w-3/4' />
          </div>

          <div className='flex shrink-0 gap-2'>
            <Skeleton className='size-6 rounded-md' />
            <Skeleton className='size-6 rounded-md' />
          </div>
        </div>

        <div className='flex items-center justify-between border-t pt-3'>
          <Skeleton className='h-5 w-28' />
          <Skeleton className='h-8 w-20 rounded-md' />
        </div>
      </div>
    </article>
  )
}
