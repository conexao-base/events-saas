import { useState } from 'react'
import type { ApiEvent } from '@/services/event.service'
import { ConfirmDeleteDialog } from './confirm-delet-dialog'
import { useEvent } from '../hooks/use-event'
import { EventsCard } from './events-card'

type EventCardWithActionsProps = {
  event: ApiEvent
  onClick: () => void
}

export function EventCardWithActions({
  event,
  onClick,
}: EventCardWithActionsProps) {
  const [open, setOpen] = useState(false)
  const { deleteEvent, isDeleting } = useEvent(event.id)

  async function handleDelete() {
    const success = await deleteEvent()

    if (success) {
      setOpen(false)
    }
  }

  return (
    <>
      <EventsCard
        event={event}
        onClick={onClick}
        onDelete={() => setOpen(true)}
      />

      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
