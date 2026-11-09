import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  primaryColor?: string
  minDate?: Date
  maxDate?: Date
  required?: boolean
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  primaryColor,
  minDate,
  maxDate,
  required,
}: DatePickerFieldProps) {
  const selectedDate = value ? parseISO(value.slice(0, 10)) : undefined

  const validDate =
    selectedDate && !Number.isNaN(selectedDate.getTime())
      ? selectedDate
      : undefined

  const currentYear = new Date().getFullYear()

  return (
    <div
      className='space-y-2'
      style={
        {
          '--calendar-primary': primaryColor || 'var(--primary)',
        } as React.CSSProperties
      }
    >
      <Label htmlFor={id} className='text-foreground'>
        {label}
        {required && <span className='ml-1 text-destructive'>*</span>}
      </Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type='button'
            variant='outline'
            className='w-full justify-start border-input bg-background text-left font-normal text-foreground hover:bg-background hover:text-foreground'
          >
            <CalendarDays className='mr-2 size-4 text-muted-foreground' />

            {validDate
              ? format(validDate, 'dd/MM/yyyy', { locale: ptBR })
              : 'dd/mm/aaaa'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={validDate}
            defaultMonth={validDate ?? new Date()}
            onSelect={(date) =>
              onChange(date ? format(date, 'yyyy-MM-dd') : '')
            }
            disabled={(date) =>
              (!!minDate && date < minDate) || (!!maxDate && date > maxDate)
            }
            locale={ptBR}
            selectedColor={primaryColor}
            startMonth={minDate ?? new Date(currentYear - 100, 0)}
            endMonth={maxDate ?? new Date(currentYear + 10, 11)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
