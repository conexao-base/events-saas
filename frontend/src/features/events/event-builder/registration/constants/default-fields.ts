
export const defaultFieldIds = [
  'full-name',
  'email',
  'phone',
  'cpf',
  'birth-date',
  'city',
] as const

export const isDefaultField = (id: string) =>
  defaultFieldIds.includes(id as (typeof defaultFieldIds)[number])
