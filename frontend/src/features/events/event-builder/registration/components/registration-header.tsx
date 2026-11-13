type RegistrationHeaderProps = {
  title?: string
  description?: string
}

export function RegistrationHeader({
  title = 'Formulário de inscrição',
  description = 'Adicione os campos que os participantes deverão preencher.',
}: RegistrationHeaderProps) {
  return (
    <div className='space-y-1'>
      <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}
