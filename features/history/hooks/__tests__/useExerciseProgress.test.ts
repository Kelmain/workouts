/**
 * TDD tests for useExerciseProgress hook.
 * Tests drive:
 *   - Returns exercise progress entries from logs via TanStack Query
 *   - Returns empty array while loading or no data
 */

import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExerciseProgress } from '../useExerciseProgress'
import { getWorkoutHistory } from '../../services/history-queries'
import type { WorkoutLog } from '../../types'

jest.mock('../../services/history-queries')
const mockGetWorkoutHistory = getWorkoutHistory as jest.MockedFunction<
  typeof getWorkoutHistory
>

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

const mockLogs: WorkoutLog[] = [
  {
    id: 'log-1',
    date: new Date('2026-03-25T10:00:00Z'),
    planType: 'upper',
    durationSeconds: 1800,
    exercises: [
      {
        exerciseId: 'kb-press',
        exerciseName: 'Kettlebell Press',
        sets: [{ reps: 8, weightKg: 20, completed: true }],
        order: 0,
      },
    ],
    notes: null,
  },
  {
    id: 'log-2',
    date: new Date('2026-03-10T10:00:00Z'),
    planType: 'upper',
    durationSeconds: 1800,
    exercises: [
      {
        exerciseId: 'kb-press',
        exerciseName: 'Kettlebell Press',
        sets: [{ reps: 6, weightKg: 16, completed: true }],
        order: 0,
      },
    ],
    notes: null,
  },
]

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client }, children)
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetWorkoutHistory.mockResolvedValue(mockLogs)
})

describe('useExerciseProgress', () => {
  it('returns exercise progress entries after loading', async () => {
    const { result } = renderHook(() => useExerciseProgress('uid-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.progress).toHaveLength(1)
    expect(result.current.progress[0].exerciseId).toBe('kb-press')
    expect(result.current.progress[0].improved).toBe(true)
  })

  it('returns empty array when no logs', async () => {
    mockGetWorkoutHistory.mockResolvedValue([])

    const { result } = renderHook(() => useExerciseProgress('uid-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.progress).toEqual([])
  })
})
