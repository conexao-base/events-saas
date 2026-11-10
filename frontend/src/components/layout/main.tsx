import { cn } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  loading?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({
  fixed,
  className,
  fluid,
  loading = false,
  children,
  ...props
}: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'relative px-4 py-3',
        fixed && 'flex grow flex-col overflow-hidden',
        !fluid &&
          '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl',
        className
      )}
      {...props}
    >
      {loading && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
          <Loading />
        </div>
      )}

      {children}
    </main>
  )
}
