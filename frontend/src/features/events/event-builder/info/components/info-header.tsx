type InfoHeaderProps = {
  title?: string
  description?: string
}

export function InfoHeader({
  title = 'Informações básicas',
  description = 'Preencha as informações principais do seu evento.',
}: InfoHeaderProps) {
  return (
    <div className='space-y-1'>
      <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>

      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}
