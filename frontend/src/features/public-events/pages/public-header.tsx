import { Link } from '@tanstack/react-router'

export function PublicHeader() {
  return (
    <header className='absolute top-1.5 right-2 z-50 w-fit rounded-lg border border-border/50 bg-background/60 backdrop-blur-md md:relative md:top-auto md:right-auto md:w-full md:rounded-none md:bg-background'>
      <div className='flex h-4 items-center justify-center gap-1 px-2 md:h-7'>
        <span className='text-[8px] text-foreground md:text-[10px]'>
          Formulário criado com
        </span>

        <Link
          to='/'
          className='text-[8px] font-semibold text-foreground hover:text-primary md:text-[10px]'
        >
          Conexão
        </Link>
      </div>
    </header>
  )
}
