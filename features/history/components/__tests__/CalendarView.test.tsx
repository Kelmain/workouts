/**
 * TDD tests for CalendarView component.
 * Tests drive:
 *   - Renders current month name
 *   - Highlights days with workouts
 *   - Calls onSelectDate when a highlighted day is tapped
 *   - Shows empty calendar gracefully when no workouts
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { CalendarView } from '../CalendarView'
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
    exercises: [],
    notes: null,
  },
  {
    id: 'log-2',
    date: new Date('2026-03-20T10:00:00Z'),
    planType: 'lower',
    durationSeconds: 3000,
    exercises: [],
    notes: null,
  },
]

describe('CalendarView', () => {
  it('renders the current month name', () => {
    render(
      <CalendarView
        logs={mockLogs}
        currentMonth={new Date('2026-03-15T00:00:00Z')}
        onSelectDate={jest.fn()}
      />
    )

    expect(screen.getByText(/march/i)).toBeTruthy()
  })

  it('highlights days with workouts', () => {
    render(
      <CalendarView
        logs={mockLogs}
        currentMonth={new Date('2026-03-15T00:00:00Z')}
        onSelectDate={jest.fn()}
      />
    )

    expect(screen.getByTestId('calendar-day-25-active')).toBeTruthy()
    expect(screen.getByTestId('calendar-day-20-active')).toBeTruthy()
  })

  it('calls onSelectDate when a highlighted day is tapped', () => {
    const onSelect = jest.fn()
    render(
      <CalendarView
        logs={mockLogs}
        currentMonth={new Date('2026-03-15T00:00:00Z')}
        onSelectDate={onSelect}
      />
    )

    fireEvent.press(screen.getByTestId('calendar-day-25-active'))

    expect(onSelect).toHaveBeenCalledWith(25)
  })

  it('renders without crashing when no workouts', () => {
    render(
      <CalendarView
        logs={[]}
        currentMonth={new Date('2026-03-15T00:00:00Z')}
        onSelectDate={jest.fn()}
      />
    )

    expect(screen.getByText(/march/i)).toBeTruthy()
  })
})
