import { useState, useEffect } from 'react'
import type { Exercise } from '../types'
import { getFilteredExercises } from '../services/exercise-data'

interface UseExerciseSearchReturn {
  results: Exercise[]
}

const DEBOUNCE_MS = 300

/**
 * Hook that returns exercises matching a debounced search term.
 * Performs case-insensitive name matching with 300ms debounce.
 *
 * @param searchTerm - The text to search by exercise name.
 */
export function useExerciseSearch(searchTerm: string): UseExerciseSearchReturn {
  const [results, setResults] = useState<Exercise[]>(() =>
    getFilteredExercises({ search: searchTerm })
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(getFilteredExercises({ search: searchTerm }))
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchTerm])

  return { results }
}
