import { useQuery } from '@tanstack/react-query'
import { getWorkoutHistory } from '../services/history-queries'
import { calculateStats } from '../services/stats-calculator'
import type { DashboardStats } from '../types'

const EMPTY_STATS: DashboardStats = {
  workoutsThisWeek: 0,
  workoutsThisMonth: 0,
  currentStreak: 0,
  totalTimeMinutes: 0,
}

export function useStats(uid: string) {
  const query = useQuery<DashboardStats>({
    queryKey: ['dashboardStats', uid],
    queryFn: async () => {
      const logs = await getWorkoutHistory(uid, { limit: 500 })
      return calculateStats(logs)
    },
    enabled: !!uid,
  })

  return {
    stats: query.data ?? EMPTY_STATS,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
