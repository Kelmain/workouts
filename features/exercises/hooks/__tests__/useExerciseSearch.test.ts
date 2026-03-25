/**
 * TDD tests for useExerciseSearch hook.
 * Tests drive the implementation of:
 *   - Returns matching exercises by name
 *   - Case-insensitive search
 *   - 300ms debounce
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
    name: 'Pull-ups',
    force: 'pull',
    level: 'intermediate',
    mechanic: 'compound',
    equipment: 'body only',
    primaryMuscles: ['lats'],
    secondaryMuscles: [],
    instructions: [],
    category: 'strength',
    images: [],
  },
  {
    id: 'ex-3',
    name: 'Kettlebell Swing',
    force: 'pull',
    level: 'intermediate',
    mechanic: 'compound',
    equipment: 'kettlebells',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    instructions: [],
    category: 'strength',
    images: [],
  },
])

import { renderHook, act } from '@testing-library/react-native'
import { useExerciseSearch } from '../useExerciseSearch'

jest.useFakeTimers()

describe('useExerciseSearch', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('returns all exercises when search term is empty', () => {
    const { result } = renderHook(() => useExerciseSearch(''))

    expect(result.current.results).toHaveLength(3)
  })

  it('returns matching exercises after debounce delay', () => {
    const { result } = renderHook(() => useExerciseSearch('push'))

    // Before debounce fires, results may still be the initial empty search
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.results.map((e) => e.id)).toContain('ex-1')
    expect(result.current.results.map((e) => e.id)).not.toContain('ex-3')
  })

  it('is case-insensitive', () => {
    const { result } = renderHook(() => useExerciseSearch('PUSH'))

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.results.map((e) => e.id)).toContain('ex-1')
  })

  it('does not update results before debounce delay', () => {
    const { result, rerender } = renderHook(
      ({ term }: { term: string }) => useExerciseSearch(term),
      { initialProps: { term: '' } }
    )

    const initialCount = result.current.results.length

    rerender({ term: 'push' })

    // Before debounce fires, should still have old results
    expect(result.current.results).toHaveLength(initialCount)
  })

  it('updates results after debounce delay when term changes', () => {
    const { result, rerender } = renderHook(
      ({ term }: { term: string }) => useExerciseSearch(term),
      { initialProps: { term: '' } }
    )

    rerender({ term: 'kettlebell' })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.results.map((e) => e.id)).toContain('ex-3')
    expect(result.current.results).toHaveLength(1)
  })
})
