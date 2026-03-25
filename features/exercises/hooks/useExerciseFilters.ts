import { useState, useMemo } from 'react'
import type { Exercise, ExerciseFilter } from '../types'
import { getFilteredExercises } from '../services/exercise-data'

type FilterKey = 'muscleGroup' | 'level' | 'force'

interface UseExerciseFiltersReturn {
  filters: Pick<ExerciseFilter, FilterKey>
  setFilter: (key: FilterKey, value: string | undefined) => void
  clearFilters: () => void
  filteredExercises: Exercise[]
}

/**
 * Hook that manages filter state for the exercise library.
 * Filters by muscle group, difficulty level, and force type.
 * All active filters are applied with AND logic.
 */
export function useExerciseFilters(): UseExerciseFiltersReturn {
  const [filters, setFilters] = useState<Pick<ExerciseFilter, FilterKey>>({})

  function setFilter(key: FilterKey, value: string | undefined): void {
    setFilters((prev) => {
      if (value === undefined) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value }
    })
  }

  function clearFilters(): void {
    setFilters({})
  }

  const filteredExercises = useMemo(
    () => getFilteredExercises(filters),
    [filters]
  )

  return { filters, setFilter, clearFilters, filteredExercises }
}
