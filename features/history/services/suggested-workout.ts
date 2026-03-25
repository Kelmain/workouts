import type { PlanType } from '@/features/workout/types'
import type { WorkoutLog } from '../types'

export function getSuggestedPlanType(logs: WorkoutLog[]): PlanType {
  if (logs.length === 0) return 'upper'

  const lastPlanType = logs[0].planType

  if (lastPlanType === 'upper') return 'lower'
  return 'upper'
}
