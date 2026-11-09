import type { CSSProperties } from 'react'
import type { City } from '@/services/ibge.service'
import { Loader2, MapPin } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Input } from '@/components/ui/input'
import { useCityInput } from '../hooks/use-city-inputs'

type CityInputProps = {
  value: string
  onChange: (value: string) => void
  primaryColor?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CityInput({
  value,
  onChange,
  primaryColor,
  placeholder = 'Digite o nome da cidade...',
  disabled,
  className,
}: CityInputProps) {
  const {
    inputRef,
    cities,
    loading,
    open,
    position,
    handleSelect,
    handleChange,
  } = useCityInput(value, onChange)

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: position.top,
    left: position.left,
    width: position.width,
    zIndex: 9999,
    '--city-primary-color': primaryColor,
  } as CSSProperties

  return (
    <div ref={inputRef} className='relative'>
      <div className='relative'>
        <Input
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete='off'
          className={`${className ?? ''} city-input`}
          style={{ '--city-primary-color': primaryColor } as CSSProperties}
        />

        {loading && (
          <Loader2 className='absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground' />
        )}
      </div>

      {open &&
        !loading &&
        createPortal(
          <div
            style={dropdownStyle}
            className='max-h-60 overflow-y-auto rounded-md border bg-popover p-1 shadow-md'
          >
            {cities.length > 0 ? (
              cities.map((city: City) => (
                <button
                  key={city.id}
                  type='button'
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(city)}
                  className='flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors outline-none hover:bg-[var(--city-primary-color)]/10 focus:bg-[var(--city-primary-color)]/10 active:bg-[var(--city-primary-color)]/20'
                >
                  <MapPin className='size-4 shrink-0 text-muted-foreground' />

                  <span className='min-w-0 flex-1'>
                    <span className='block font-medium'>{city.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {city.stateName} ({city.state})
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className='px-3 py-4 text-center text-sm text-muted-foreground'>
                Nenhuma cidade encontrada.
              </p>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
