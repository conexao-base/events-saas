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
  minDate?: Date
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  minDate,
}: DatePickerFieldProps) {
  const selectedDate = value ? parseISO(value.slice(0, 10)) : undefined

  const validDate =
    selectedDate && !Number.isNaN(selectedDate.getTime())
      ? selectedDate
      : undefined

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type='button'
            variant='outline'
            className='w-full justify-start text-left font-normal'
          >
            <CalendarDays className='mr-2 size-4' />
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
            disabled={minDate ? { before: minDate } : undefined}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
