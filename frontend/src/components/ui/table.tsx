import * as React from 'react'
import { cn } from '@/lib/utils'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isDragging = React.useRef(false)
  const startX = React.useRef(0)
  const scrollLeft = React.useRef(0)

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    const container = containerRef.current

    if (!container || event.button !== 0) return

    isDragging.current = true
    startX.current = event.clientX
    scrollLeft.current = container.scrollLeft
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const container = containerRef.current

    if (!container || !isDragging.current) return

    const distance = event.clientX - startX.current
    container.scrollLeft = scrollLeft.current - distance
  }

  function stopDragging() {
    isDragging.current = false
  }

  return (
    <div
      ref={containerRef}
      data-slot='table-container'
      className='relative w-full cursor-grab [scrollbar-width:none] overflow-x-auto [-ms-overflow-style:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <table
        data-slot='table'
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot='table-header'
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot='table-body'
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot='table-row'
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'h-10 px-2 text-start align-middle font-medium whitespace-nowrap text-foreground *:[[role=checkbox]]:translate-y-0.5',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn(
        'p-2 align-middle whitespace-nowrap *:[[role=checkbox]]:translate-y-0.5',
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot='table-caption'
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
