import type { ZodError } from 'zod'

export function getZodErrors(error: ZodError) {
  const errors: Record<string, string> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')

    if (!errors[path]) {
      errors[path] = issue.message
    }
  }

  return errors
}
