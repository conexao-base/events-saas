import { ClientsActionDialog } from './clients-action-dialog'
import { useClients } from './clients-provider'

export function ClientsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useClients()
  return (
    <>
      <ClientsActionDialog
        key='client-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <ClientsActionDialog
            key={`client-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
