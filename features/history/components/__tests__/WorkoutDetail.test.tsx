/**
 * TDD tests for WorkoutDetail component.
 * Tests drive:
 *   - Renders date, plan type, duration
 *   - Renders per-exercise sets with reps and weight
 *   - Handles bodyweight exercises (null weight)
 */

import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { WorkoutDetail } from '../WorkoutDetail'
import type { WorkoutLog } from '../../types'

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

const mockLog: WorkoutLog = {
  id: 'log-1',
  date: new Date('2026-03-25T10:00:00Z'),
  planType: 'upper',
  durationSeconds: 2700,
  exercises: [
    {
      exerciseId: 'kb-press',
      exerciseName: 'Kettlebell Press',
      sets: [
        { reps: 8, weightKg: 16, completed: true },
        { reps: 6, weightKg: 16, completed: true },
      ],
      order: 0,
    },
    {
      exerciseId: 'pushup',
      exerciseName: 'Push-up',
      sets: [
        { reps: 15, weightKg: null, completed: true },
      ],
      order: 1,
    },
  ],
  notes: null,
}

describe('WorkoutDetail', () => {
  it('renders plan type', () => {
    render(<WorkoutDetail log={mockLog} />)

    expect(screen.getByText(/upper/i)).toBeTruthy()
  })

  it('renders duration', () => {
    render(<WorkoutDetail log={mockLog} />)

    expect(screen.getByText(/45\s*min/i)).toBeTruthy()
  })

  it('renders exercise names', () => {
    render(<WorkoutDetail log={mockLog} />)

    expect(screen.getByText('Kettlebell Press')).toBeTruthy()
    expect(screen.getByText('Push-up')).toBeTruthy()
  })

  it('renders sets with weight for weighted exercises', () => {
    render(<WorkoutDetail log={mockLog} />)

    expect(screen.getByText(/8 reps.*16\s*kg/)).toBeTruthy()
  })

  it('renders sets without weight for bodyweight exercises', () => {
    render(<WorkoutDetail log={mockLog} />)

    expect(screen.getByText(/15 reps/)).toBeTruthy()
  })
})
