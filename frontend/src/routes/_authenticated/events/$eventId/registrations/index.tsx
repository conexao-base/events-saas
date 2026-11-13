import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Registrations } from '@/features/registrations'

const registrationsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),

  status: z
    .array(z.enum(['pending', 'confirmed', 'cancelled']))
    .optional()
    .catch([]),

  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/events/$eventId/registrations/'
)({
  validateSearch: registrationsSearchSchema,
  component: Registrations,
})
