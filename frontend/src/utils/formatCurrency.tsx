export function formatCurrency(value: string | null | undefined) {
  const numbers = (value ?? '').replace(/\D/g, '')

  if (!numbers) return ''

  return (Number(numbers) / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseCurrency(value: string): number | null {
  if (!value) return null

  return Number(value.replace(/\./g, '').replace(',', '.'))
}
