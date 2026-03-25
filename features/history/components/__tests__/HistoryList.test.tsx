/**
 * TDD tests for HistoryList component.
 * Tests drive:
 *   - Renders workout entries with date, plan type, duration, exercise count
 *   - Shows empty state message when logs is empty
 *   - Calls onPressItem with log id when an entry is tapped
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { HistoryList } from '../HistoryList'
import type { WorkoutLog } from '../../types'

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
    exercises: [
      {
        exerciseId: 'ex1',
        exerciseName: 'Push-up',
        sets: [{ reps: 10, weightKg: null, completed: true }],
        order: 0,
      },
      {
        exerciseId: 'ex2',
        exerciseName: 'Pull-up',
        sets: [{ reps: 8, weightKg: null, completed: true }],
        order: 1,
      },
    ],
    notes: null,
  },
  {
    id: 'log-2',
    date: new Date('2026-03-23T09:00:00Z'),
    planType: 'lower',
    durationSeconds: 3600,
    exercises: [
      {
        exerciseId: 'ex3',
        exerciseName: 'Squat',
        sets: [{ reps: 12, weightKg: 16, completed: true }],
        order: 0,
      },
    ],
    notes: null,
  },
]

describe('HistoryList', () => {
  it('renders workout entries with plan type', () => {
    render(<HistoryList logs={mockLogs} onPressItem={jest.fn()} />)

    expect(screen.getByText(/upper/i)).toBeTruthy()
    expect(screen.getByText(/lower/i)).toBeTruthy()
  })

  it('renders exercise count for each entry', () => {
    render(<HistoryList logs={mockLogs} onPressItem={jest.fn()} />)

    expect(screen.getByText(/2 exercises/i)).toBeTruthy()
    expect(screen.getByText(/1 exercise/i)).toBeTruthy()
  })

  it('renders duration for each entry', () => {
    render(<HistoryList logs={mockLogs} onPressItem={jest.fn()} />)

    // 2700s = 45min, 3600s = 60min
    expect(screen.getByText(/45\s*min/i)).toBeTruthy()
    expect(screen.getByText(/60\s*min/i)).toBeTruthy()
  })

  it('shows empty state message when logs is empty', () => {
    render(<HistoryList logs={[]} onPressItem={jest.fn()} />)

    expect(
      screen.getByText(/no workouts yet/i)
    ).toBeTruthy()
  })

  it('calls onPressItem with log id when tapped', () => {
    const onPress = jest.fn()
    render(<HistoryList logs={mockLogs} onPressItem={onPress} />)

    fireEvent.press(screen.getByText(/upper/i))

    expect(onPress).toHaveBeenCalledWith('log-1')
  })
})
