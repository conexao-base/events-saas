
import { type ClientStatus } from './schema'

export const callTypes = new Map<ClientStatus, string>([
  [
    'paid',
    'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  ],
  [
    'pending',
    'bg-amber-100/40 text-amber-900 dark:text-amber-200 border-amber-300',
  ],
  [
    'cancelled',
    'bg-destructive/10 text-destructive border-destructive/20',
  ],
  [
    'refunded',
    'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  ],
])
