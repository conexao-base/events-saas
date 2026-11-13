import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { registrationService } from '@/services/registration.service'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type RegistrationsDeleteDialogProps = {
  registrationId: string
  eventId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegistrationsDeleteDialog({
  registrationId,
  eventId,
  open,
  onOpenChange,
}: RegistrationsDeleteDialogProps) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)

      await registrationService.remove(registrationId)

      await queryClient.invalidateQueries({
        queryKey: ['registrations', eventId],
      })

      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover inscrição?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeita. A inscrição será removida
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant='destructive'
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? 'Removendo...' : 'Remover'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
