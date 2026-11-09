import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RegistrationFieldOptionsProps = {
  options: string[]
  updateOption: (index: number, value: string) => void
  addOption: () => void
  removeOption: (index: number) => void
}

export function RegistrationFieldOptions({
  options,
  updateOption,
  addOption,
  removeOption,
}: RegistrationFieldOptionsProps) {
  return (
    <div className='w-full min-w-0 space-y-3 rounded-md p-3 sm:p-4'>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>Opções de resposta</p>

        {options.map((option, index) => (
          <div key={index} className='flex min-w-0 items-center gap-2'>
            <Input
              value={option}
              onChange={(event) => updateOption(index, event.target.value)}
              placeholder={`Opção ${index + 1}`}
              aria-label={`Nome da opção ${index + 1}`}
              className='h-9 min-w-0 flex-1 bg-background'
            />

            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
              onClick={() => removeOption(index)}
              disabled={options.length <= 1}
              aria-label={`Excluir opção ${index + 1}`}
            >
              <Trash2 className='size-4' />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type='button'
        variant='outline'
        size='sm'
        className='w-full sm:w-auto'
        onClick={addOption}
      >
        <Plus className='mr-1 size-3.5' />
        Adicionar opção
      </Button>
    </div>
  )
}
