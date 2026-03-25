import { useQuery } from '@tanstack/react-query'
import { getWorkoutHistory } from '../services/history-queries'
import type { WorkoutLog, HistoryQueryOptions } from '../types'

export function useWorkoutHistory(uid: string, options?: HistoryQueryOptions) {
  const query = useQuery<WorkoutLog[]>({
    queryKey: ['workoutHistory', uid, options],
    queryFn: () => getWorkoutHistory(uid, options),
    enabled: !!uid,
  })

  return {
    logs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
