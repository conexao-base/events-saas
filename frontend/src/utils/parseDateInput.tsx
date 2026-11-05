export function parseDateInput(value: string): Date | undefined {
  if (!value) return undefined

  const [year, month, day] = value.slice(0, 10).split('-').map(Number)

  if (!year || !month || !day) return undefined

  return new Date(year, month - 1, day)
}
