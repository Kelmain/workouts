import { useMemo } from 'react'
import type { Exercise } from '../types'
import { getFilteredExercises } from '../services/exercise-data'
import { useEquipment } from '@/features/equipment/hooks/useEquipment'

interface UseExercisesReturn {
  exercises: Exercise[]
  loading: boolean
}

/**
 * Returns exercises filtered by the current user's equipment list.
 * Fetches equipment from Firestore via useEquipment, then filters the bundled JSON database.
 */
export function useExercises(): UseExercisesReturn {
  const { equipment, loading } = useEquipment()

  const exercises = useMemo(() => {
    if (loading) return []
    return getFilteredExercises({ equipment })
  }, [equipment, loading])

  return { exercises, loading }
}
