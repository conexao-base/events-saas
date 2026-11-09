interface FieldErrorProps {
  error?: string
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null

  return (
    <p className='text-xs text-destructive' role='alert'>
      {error}
    </p>
  )
}
