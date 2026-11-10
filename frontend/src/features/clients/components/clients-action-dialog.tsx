'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { type Client } from '../data/schema'

const formSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório.'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'E-mail é obrigatório.' : undefined),
  }),
  phoneNumber: z.string().min(1, 'Celular é obrigatório.'),
  status: z.enum(['paid', 'pending', 'cancelled', 'refunded']),
  amount: z.coerce.number().min(0, 'O valor não pode ser negativo.'),
  isEdit: z.boolean(),
})

type ClientFormInput = z.input<typeof formSchema>
type ClientForm = z.infer<typeof formSchema>

type ClientActionDialogProps = {
  currentRow?: Client
  open: boolean
  onOpenChange: (open: boolean) => void
}

const paymentStatuses = [
  { label: 'Pago', value: 'paid' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Cancelado', value: 'cancelled' },
  { label: 'Reembolsado', value: 'refunded' },
]

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function parseCurrency(value: string) {
  const digits = value.replace(/\D/g, '')
  return Number(digits || 0) / 100
}

export function ClientsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ClientActionDialogProps) {
  const isEdit = !!currentRow

  const form = useForm<ClientFormInput, unknown, ClientForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          firstName: currentRow.firstName,
          lastName: currentRow.lastName,
          email: currentRow.email,
          phoneNumber: currentRow.phoneNumber,
          status: currentRow.status,
          amount: currentRow.amount,
          isEdit,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          status: 'pending',
          amount: 0,
          isEdit,
        },
  })

  const onSubmit = (values: ClientForm) => {
    showSubmittedData(values)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <UserPlus className='size-5' />
            {isEdit ? 'Editar participante' : 'Adicionar participante'}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do participante.'
              : 'Cadastre um novo participante do retiro...'}{' '}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='client-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {/* Nome e sobrenome */}
            <div className='grid grid-cols-2 items-start gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='min-w-0'>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input className='w-full' placeholder='Nome' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='min-w-0'>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        placeholder='Sobrenome'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* E-mail */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='participante@email.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Celular */}
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='(31) 99999-9999'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status e valor com larguras iguais */}
            <div className='grid grid-cols-2 items-start gap-4'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='min-w-0'>
                    <FormLabel>Status do pagamento</FormLabel>
                    <FormControl>
                      <div className='w-full min-w-0 [&_button]:w-full'>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Selecione'
                          items={paymentStatuses}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem className='min-w-0'>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        inputMode='decimal'
                        placeholder='0,00'
                        className='w-full text-right tabular-nums'
                        value={formatCurrency(Number(field.value) || 0)}
                        onChange={(event) => {
                          field.onChange(parseCurrency(event.target.value))
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='client-form' className='w-full sm:w-auto'>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
