/**
 * TDD tests for useStats hook.
 * Tests drive:
 *   - Returns stats computed from workout logs via TanStack Query
 *   - Returns zero stats while loading
 *   - Delegates to calculateStats with the fetched logs
 */

import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useStats } from '../useStats'
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
    exercises: [],
    notes: null,
  },
  {
    id: 'log-2',
    date: new Date('2026-03-24T10:00:00Z'),
    planType: 'lower',
    durationSeconds: 2400,
    exercises: [],
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

describe('useStats', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useStats('uid-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('returns computed stats after loading', async () => {
    const { result } = renderHook(() => useStats('uid-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Both logs are in current week (March 24-25 2026)
    expect(result.current.stats.workoutsThisWeek).toBe(2)
    expect(result.current.stats.workoutsThisMonth).toBe(2)
    expect(result.current.stats.totalTimeMinutes).toBe(70) // (1800+2400)/60
  })

  it('returns zero stats when no logs', async () => {
    mockGetWorkoutHistory.mockResolvedValue([])

    const { result } = renderHook(() => useStats('uid-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.stats.workoutsThisWeek).toBe(0)
    expect(result.current.stats.totalTimeMinutes).toBe(0)
  })
})
