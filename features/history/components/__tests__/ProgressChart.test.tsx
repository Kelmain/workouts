/**
 * TDD tests for ProgressChart component.
 * Tests drive:
 *   - Renders exercise names
 *   - Shows first vs latest weight/reps
 *   - Shows improvement indicator for improved exercises
 *   - Shows empty state when no progress data
 */

import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ProgressChart } from '../ProgressChart'
import type { ExerciseProgressEntry } from '../../types'

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

const mockProgress: ExerciseProgressEntry[] = [
  {
    exerciseId: 'kb-press',
    exerciseName: 'Kettlebell Press',
    firstLog: {
      date: new Date('2026-03-10T10:00:00Z'),
      maxWeightKg: 16,
      maxReps: 6,
    },
    latestLog: {
      date: new Date('2026-03-25T10:00:00Z'),
      maxWeightKg: 20,
      maxReps: 8,
    },
    improved: true,
  },
  {
    exerciseId: 'pushup',
    exerciseName: 'Push-up',
    firstLog: {
      date: new Date('2026-03-10T10:00:00Z'),
      maxWeightKg: null,
      maxReps: 10,
    },
    latestLog: {
      date: new Date('2026-03-25T10:00:00Z'),
      maxWeightKg: null,
      maxReps: 10,
    },
    improved: false,
  },
]

describe('ProgressChart', () => {
  it('renders exercise names', () => {
    render(<ProgressChart progress={mockProgress} />)

    expect(screen.getByText('Kettlebell Press')).toBeTruthy()
    expect(screen.getByText('Push-up')).toBeTruthy()
  })

  it('shows weight progression for weighted exercises', () => {
    render(<ProgressChart progress={mockProgress} />)

    expect(screen.getByText(/16\s*kg/)).toBeTruthy()
    expect(screen.getByText(/20\s*kg/)).toBeTruthy()
  })

  it('shows reps for bodyweight exercises', () => {
    render(<ProgressChart progress={mockProgress} />)

    // Push-up: 10 reps first and latest
    expect(screen.getAllByText(/10\s*reps/).length).toBeGreaterThanOrEqual(1)
  })

  it('shows improvement indicator for improved exercises', () => {
    render(<ProgressChart progress={mockProgress} />)

    // Kettlebell Press is improved
    expect(screen.getByTestId('improved-kb-press')).toBeTruthy()
  })

  it('shows empty state when no progress data', () => {
    render(<ProgressChart progress={[]} />)

    expect(screen.getByText(/no progress data/i)).toBeTruthy()
  })
})
