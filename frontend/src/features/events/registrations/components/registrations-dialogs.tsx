import type { RegistrationFieldDTO } from '@/services/event.service'
import { RegistrationsActionDialog } from './registrations-action-dialog'
import { RegistrationsDeleteDialog } from './registrations-delete-dialog'
import { useRegistrations } from './registrations-provider'

type RegistrationsDialogsProps = {
  eventId: string
  eventPrice: string
  registrationFields: RegistrationFieldDTO[]
}

export function RegistrationsDialogs({
  eventId,
  eventPrice,
  registrationFields,
}: RegistrationsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useRegistrations()

  return (
    <>
      <RegistrationsActionDialog
        key='registration-add'
        eventId={eventId}
        eventPrice={eventPrice}
        registrationFields={registrationFields}
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />

      {currentRow && (
        <>
          <RegistrationsActionDialog
            key={`registration-edit-${currentRow.id}`}
            eventId={eventId}
            eventPrice={eventPrice}
            registrationFields={registrationFields}
            open={open === 'edit'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null)
                setCurrentRow(null)
              }
            }}
            currentRow={currentRow}
          />

          <RegistrationsDeleteDialog
            registrationId={currentRow.id}
            eventId={eventId}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null)
                setCurrentRow(null)
              }
            }}
          />
        </>
      )}
    </>
  )
}
