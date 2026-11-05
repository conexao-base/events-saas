import { CheckCircle2 } from 'lucide-react'

export function RegistrationSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <CheckCircle2 className="mb-4 size-14 text-green-600" />

      <h3 className="text-xl font-semibold">Inscrição realizada!</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Sua inscrição foi recebida com sucesso. Agradecemos pelo seu interesse
        em participar!
      </p>
    </div>
  )
}