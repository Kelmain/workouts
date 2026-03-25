/**
 * TDD tests for useExerciseFilters hook.
 * Tests drive the implementation of:
 *   - Filter state management (muscleGroup, difficulty, force type)
 *   - setFilter updates individual filters
 *   - clearFilters resets all
 *   - filteredExercises reflects current filter state
 */

jest.mock('../../../../assets/data/exercises.json', () => [
  {
    id: 'ex-1',
    name: 'Push-ups',
    force: 'push',
    level: 'beginner',
    mechanic: 'compound',
    equipment: null,
    primaryMuscles: ['chest'],
    secondaryMuscles: [],
    instructions: [],
    category: 'strength',
    images: [],
  },
  {
    id: 'ex-2',
    name: 'Barbell Row',
    force: 'pull',
    level: 'intermediate',
    mechanic: 'compound',
    equipment: 'barbell',
    primaryMuscles: ['middle back'],
    secondaryMuscles: [],
    instructions: [],
    category: 'strength',
    images: [],
  },
  {
    id: 'ex-3',
    name: 'Bicep Curl',
    force: 'pull',
    level: 'beginner',
    mechanic: 'isolation',
    equipment: 'barbell',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    instructions: [],
    category: 'strength',
    images: [],
  },
])

import { renderHook, act } from '@testing-library/react-native'
import { useExerciseFilters } from '../useExerciseFilters'

describe('useExerciseFilters', () => {
  it('returns all exercises initially (no filters)', () => {
    const { result } = renderHook(() => useExerciseFilters())

    expect(result.current.filteredExercises).toHaveLength(3)
  })

  it('returns empty filters initially', () => {
    const { result } = renderHook(() => useExerciseFilters())

    expect(result.current.filters.muscleGroup).toBeUndefined()
    expect(result.current.filters.level).toBeUndefined()
    expect(result.current.filters.force).toBeUndefined()
  })

  it('setFilter updates a single filter and re-filters exercises', () => {
    const { result } = renderHook(() => useExerciseFilters())

    act(() => {
      result.current.setFilter('level', 'beginner')
    })

    expect(result.current.filters.level).toBe('beginner')
    expect(result.current.filteredExercises.map((e) => e.id)).toContain('ex-1')
    expect(result.current.filteredExercises.map((e) => e.id)).not.toContain('ex-2')
  })

  it('multiple filters compose with AND logic', () => {
    const { result } = renderHook(() => useExerciseFilters())

    act(() => {
      result.current.setFilter('force', 'pull')
      result.current.setFilter('level', 'beginner')
    })

    // Only ex-3 is pull AND beginner
    expect(result.current.filteredExercises).toHaveLength(1)
    expect(result.current.filteredExercises[0].id).toBe('ex-3')
  })

  it('clearFilters resets all filters and returns all exercises', () => {
    const { result } = renderHook(() => useExerciseFilters())

    act(() => {
      result.current.setFilter('level', 'beginner')
      result.current.setFilter('force', 'push')
    })

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.filters.level).toBeUndefined()
    expect(result.current.filters.force).toBeUndefined()
    expect(result.current.filteredExercises).toHaveLength(3)
  })

  it('setFilter for muscleGroup filters by primaryMuscles', () => {
    const { result } = renderHook(() => useExerciseFilters())

    act(() => {
      result.current.setFilter('muscleGroup', 'chest')
    })

    expect(result.current.filteredExercises.map((e) => e.id)).toContain('ex-1')
    expect(result.current.filteredExercises.map((e) => e.id)).not.toContain('ex-2')
  })
})
