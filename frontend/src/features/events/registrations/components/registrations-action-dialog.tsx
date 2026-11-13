import { useEffect, useMemo } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { RegistrationFieldDTO } from '@/services/event.service'
import {
  type ApiRegistration,
  registrationService,
} from '@/services/registration.service'
import { createRegistrationSchema } from '@conexao/shared/schemas/registration.schema'
import { ClipboardList, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import type { RegistrationForm } from '../types/registration-form.types'
import {
  RegistrationFields,
  RegistrationPriceField,
  RegistrationStatusField,
} from './registration-form-fields'

type RegistrationActionDialogProps = {
  currentRow?: ApiRegistration
  eventId: string
  eventPrice: string
  registrationFields: RegistrationFieldDTO[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegistrationsActionDialog({
  currentRow,
  eventId,
  eventPrice,
  registrationFields,
  open,
  onOpenChange,
}: RegistrationActionDialogProps) {
  const queryClient = useQueryClient()
  const isEdit = !!currentRow

  const formSchema = useMemo(
    () =>
      createRegistrationSchema(registrationFields).safeExtend({
        status: z.enum(['pending', 'confirmed', 'cancelled']),
      }),
    [registrationFields]
  )
  const defaultValues = useMemo(
    () => ({
      status: currentRow?.status ?? 'pending',
      price: currentRow?.price ?? eventPrice,
      answers: Object.fromEntries(
        registrationFields.map((field) => [
          field.id,
          String(currentRow?.data[field.id] ?? ''),
        ])
      ),
    }),
    [currentRow, eventPrice, registrationFields]
  )

  const form = useForm<RegistrationForm, undefined, RegistrationForm>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const onSubmit = async (values: RegistrationForm) => {
    if (currentRow) {
      await registrationService.update(currentRow.id, {
        data: values.answers,
        price: values.price ?? '0',
        status: values.status,
      })
    } else {
      await registrationService.createByAdmin(eventId, {
        data: values.answers,
        price: values.price ?? '0',
        status: values.status,
      })
    }

    await queryClient.invalidateQueries({
      queryKey: ['registrations', eventId],
    })

    form.reset()
    onOpenChange(false)
  }

  const handleOpenChange = (state: boolean) => {
    if (!state) form.reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            {isEdit ? (
              <ClipboardList className='size-5' />
            ) : (
              <UserPlus className='size-5' />
            )}
            {isEdit ? 'Editar inscrição' : 'Adicionar inscrição'}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? 'Atualize os dados desta inscrição.'
              : 'Preencha os dados para cadastrar um participante.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='registration-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <RegistrationFields form={form} fields={registrationFields} />

            <RegistrationPriceField form={form} />

            <RegistrationStatusField form={form} />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type='submit'
            form='registration-form'
            className='w-full sm:w-auto'
            disabled={form.formState.isSubmitting}
          >
            {isEdit ? 'Salvar alterações' : 'Adicionar inscrição'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
