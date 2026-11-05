export function formatDate(value: string) {
  if (!value) return ''

  const date = new Date(`${value.slice(0, 10)}T12:00:00`)

  return new Intl.DateTimeFormat('pt-BR').format(date)
}
