import { Link } from '@tanstack/react-router'

export function PublicFooter() {
  return (
    <footer className='mt-auto border-t bg-muted/20'>
      <div className='flex min-h-10 flex-col items-center justify-center gap-1 px-4 py-2 sm:flex-row sm:gap-2'>
        <p className='text-[12px] text-muted-foreground'>
          © {new Date().getFullYear()} Conexão.
        </p>

        <Link
          to='/'
          className='text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground'
        >
          Formulários criados com Conexão
        </Link>
      </div>
    </footer>
  )
}
