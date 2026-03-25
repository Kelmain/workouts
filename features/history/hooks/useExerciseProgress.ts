import { useQuery } from '@tanstack/react-query'
import { getWorkoutHistory } from '../services/history-queries'
import { calculateExerciseProgress } from '../services/stats-calculator'
import type { ExerciseProgressEntry } from '../types'

export function useExerciseProgress(uid: string) {
  const query = useQuery<ExerciseProgressEntry[]>({
    queryKey: ['exerciseProgress', uid],
    queryFn: async () => {
      const logs = await getWorkoutHistory(uid, { limit: 500 })
      return calculateExerciseProgress(logs)
    },
    enabled: !!uid,
  })

  return {
    progress: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
