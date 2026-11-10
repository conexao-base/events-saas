import { z } from 'zod'

const clientStatusSchema = z.union([
  z.literal('paid'),
  z.literal('pending'),
  z.literal('cancelled'),
  z.literal('refunded'),
])

export type ClientStatus = z.infer<typeof clientStatusSchema>

const _clientSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: clientStatusSchema,
  amount: z.number().min(0, 'O valor não pode ser negativo.'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Client = z.infer<typeof _clientSchema>
