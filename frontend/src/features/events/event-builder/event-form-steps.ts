export type EventStep = 'info' | 'registration'
type RouteStep = EventStep | 'preview'

const STORAGE_KEY = 'event-form-steps'

function getCompletedSteps(): EventStep[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

let completedSteps: EventStep[] = getCompletedSteps()

function persistSteps() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(completedSteps))
}

export function completeStep(step: EventStep) {
  if (step === 'info') {
    completedSteps = ['info']
  } else if (completedSteps.includes('info')) {
    completedSteps = ['info', 'registration']
  }

  persistSteps()
}

export function canAccessStep(step: Exclude<RouteStep, 'info'>) {
  if (step === 'registration') {
    return completedSteps.includes('info')
  }

  return (
    completedSteps.includes('info') && completedSteps.includes('registration')
  )
}

export function getFirstPendingStep(): RouteStep {
  if (!completedSteps.includes('info')) return 'info'
  if (!completedSteps.includes('registration')) return 'registration'

  return 'preview'
}

export function resetSteps() {
  completedSteps = []
  sessionStorage.removeItem(STORAGE_KEY)
}
