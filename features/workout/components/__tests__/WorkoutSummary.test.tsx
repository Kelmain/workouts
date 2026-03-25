import React from 'react'
import { render } from '@testing-library/react-native'
import { WorkoutSummary } from '../WorkoutSummary'
import type { ExerciseLog } from '../../types'

function makeLog(id: string, setsCount: number): ExerciseLog {
  const sets = Array.from({ length: setsCount }, (_, i) => ({
    reps: 10,
    weightKg: i % 2 === 0 ? 50 : null,
    completed: true,
  }))
  return { exerciseId: id, exerciseName: `Exercise ${id}`, sets, order: 0 }
}

describe('WorkoutSummary', () => {
  it('shows "Workout Complete" heading', () => {
    const { getByText } = render(
      <WorkoutSummary exercises={[]} durationSeconds={0} />
    )
    expect(getByText(/Workout Complete/i)).toBeTruthy()
  })

  it('displays the number of exercises completed', () => {
    const exercises: ExerciseLog[] = [makeLog('1', 3), makeLog('2', 2)]
    const { getByTestId } = render(
      <WorkoutSummary exercises={exercises} durationSeconds={300} />
    )
    expect(getByTestId('summary-exercises').props.children).toEqual(
      expect.arrayContaining([2])
    )
  })

  it('displays total sets logged', () => {
    const exercises: ExerciseLog[] = [makeLog('1', 3), makeLog('2', 2)]
    const { getByTestId } = render(
      <WorkoutSummary exercises={exercises} durationSeconds={300} />
    )
    // total sets = 5
    expect(getByTestId('summary-sets').props.children).toEqual(
      expect.arrayContaining([5])
    )
  })

  it('displays workout duration formatted as minutes', () => {
    const exercises: ExerciseLog[] = [makeLog('1', 1)]
    const { getByTestId } = render(
      <WorkoutSummary exercises={exercises} durationSeconds={125} />
    )
    // 125 seconds = "2 min 5 sec"
    const durationText = getByTestId('summary-duration').props.children
    expect(durationText).toContain('2 min')
  })

  it('displays zero duration as 0 min 0 sec', () => {
    const { getByTestId } = render(
      <WorkoutSummary exercises={[]} durationSeconds={0} />
    )
    const durationText = getByTestId('summary-duration').props.children
    expect(durationText).toContain('0 min')
  })

  it('handles exercises with zero sets (counts only completed sets)', () => {
    const exercises: ExerciseLog[] = [makeLog('1', 0), makeLog('2', 4)]
    const { getByTestId } = render(
      <WorkoutSummary exercises={exercises} durationSeconds={60} />
    )
    // total sets = 4
    expect(getByTestId('summary-sets').props.children).toEqual(
      expect.arrayContaining([4])
    )
  })
})
