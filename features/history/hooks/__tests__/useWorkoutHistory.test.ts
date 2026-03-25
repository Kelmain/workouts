/**
 * TDD tests for useWorkoutHistory hook.
 * Tests drive:
 *   - Returns workout logs from getWorkoutHistory via TanStack Query
 *   - Shows loading state initially
 *   - Returns empty array when no logs exist
 *   - Passes uid and options through to the service
 */

import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useWorkoutHistory } from '../useWorkoutHistory'
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
    durationSeconds: 2700,
    exercises: [],
    notes: null,
  },
]

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client },
      children
    )
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetWorkoutHistory.mockResolvedValue(mockLogs)
})

describe('useWorkoutHistory', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useWorkoutHistory('uid-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('returns workout logs after loading', async () => {
    const { result } = renderHook(() => useWorkoutHistory('uid-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.logs).toEqual(mockLogs)
  })

  it('calls getWorkoutHistory with uid', async () => {
    const { result } = renderHook(() => useWorkoutHistory('uid-abc'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGetWorkoutHistory).toHaveBeenCalledWith('uid-abc', undefined)
  })

  it('returns empty logs array when no data', async () => {
    mockGetWorkoutHistory.mockResolvedValue([])

    const { result } = renderHook(() => useWorkoutHistory('uid-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.logs).toEqual([])
  })
})
