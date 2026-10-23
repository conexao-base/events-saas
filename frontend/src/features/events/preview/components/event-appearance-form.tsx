import { usePreview } from './preview-provider'

export function EventAppearanceForm() {
  const { appearance, setAppearance } = usePreview()

  const primaryColor = appearance.primaryColor || '#245C43'

  return (
    <section className='min-w-0 space-y-6'>
      <div>
        <h2 className='font-semibold'>Aparência</h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Personalize as cores e as imagens da página do evento.
        </p>
      </div>

      <div className='space-y-3'>
        <label htmlFor='event-primary-color' className='text-sm font-medium'>
          Cor principal
        </label>

        <div className='flex items-center gap-3 rounded-lg border p-2'>
          <label
            htmlFor='event-primary-color'
            className='relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border'
            style={{ backgroundColor: primaryColor }}
          >
            <input
              id='event-primary-color'
              type='color'
              value={primaryColor}
              onChange={(event) =>
                setAppearance((current) => ({
                  ...current,
                  primaryColor: event.target.value,
                }))
              }
              aria-label='Selecionar cor principal do evento'
              className='absolute inset-0 size-full cursor-pointer opacity-0'
            />
          </label>

          <p className='min-w-0 flex-1 font-mono text-xs text-muted-foreground'>
            {primaryColor.toUpperCase()}
          </p>
        </div>
      </div>

      <div className='space-y-2'>
        <label htmlFor='cover-image' className='text-sm font-medium'>
          Imagem de capa
        </label>

        <input
          id='cover-image'
          type='url'
          value={appearance.coverImage ?? ''}
          onChange={(event) =>
            setAppearance((current) => ({
              ...current,
              coverImage: event.target.value,
            }))
          }
          placeholder='https://exemplo.com/capa.jpg'
          className='h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='event-logo' className='text-sm font-medium'>
          Logo do evento
          <span className='ml-1 font-normal text-muted-foreground'>
            (opcional)
          </span>
        </label>

        <input
          id='event-logo'
          type='url'
          value={appearance.logo ?? ''}
          onChange={(event) =>
            setAppearance((current) => ({
              ...current,
              logo: event.target.value,
            }))
          }
          placeholder='https://exemplo.com/logo.png'
          className='h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
        />
      </div>
    </section>
  )
}
