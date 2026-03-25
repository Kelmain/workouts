import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'
import { SetLogger } from '../SetLogger'
import { useWorkoutStore } from '../../stores/workout-store'

// Reset store before each test
beforeEach(() => {
  act(() => {
    useWorkoutStore.getState().resetWorkout()
    useWorkoutStore.getState().startWorkout('upper', [
      { id: 'ex1', name: 'Push-up', equipment: null, primaryMuscles: ['chest'], secondaryMuscles: [] },
    ])
  })
})

describe('SetLogger', () => {
  it('renders reps input with default value of 10', () => {
    const { getByTestId } = render(<SetLogger />)
    expect(getByTestId('reps-input').props.value).toBe('10')
  })

  it('renders weight input with default value of 0', () => {
    const { getByTestId } = render(<SetLogger />)
    expect(getByTestId('weight-input').props.value).toBe('0')
  })

  it('increases reps when + stepper is pressed', () => {
    const { getByTestId } = render(<SetLogger />)
    fireEvent.press(getByTestId('reps-increment'))
    expect(getByTestId('reps-input').props.value).toBe('11')
  })

  it('decreases reps when - stepper is pressed', () => {
    const { getByTestId } = render(<SetLogger />)
    fireEvent.press(getByTestId('reps-decrement'))
    expect(getByTestId('reps-input').props.value).toBe('9')
  })

  it('does not decrease reps below 1', () => {
    const { getByTestId } = render(<SetLogger />)
    // Press decrement 20 times
    for (let i = 0; i < 20; i++) {
      fireEvent.press(getByTestId('reps-decrement'))
    }
    expect(getByTestId('reps-input').props.value).toBe('1')
  })

  it('increases weight by 2 when + stepper is pressed', () => {
    const { getByTestId } = render(<SetLogger />)
    fireEvent.press(getByTestId('weight-increment'))
    expect(getByTestId('weight-input').props.value).toBe('2')
  })

  it('decreases weight by 2 when - stepper is pressed', () => {
    const { getByTestId } = render(<SetLogger />)
    fireEvent.press(getByTestId('weight-increment')) // to 2
    fireEvent.press(getByTestId('weight-decrement')) // back to 0
    expect(getByTestId('weight-input').props.value).toBe('0')
  })

  it('does not decrease weight below 0', () => {
    const { getByTestId } = render(<SetLogger />)
    fireEvent.press(getByTestId('weight-decrement'))
    expect(getByTestId('weight-input').props.value).toBe('0')
  })

  it('calls logSet with current reps and weight when Log Set is pressed', () => {
    const logSetSpy = jest.spyOn(useWorkoutStore.getState(), 'logSet')
    const { getByTestId } = render(<SetLogger />)
    fireEvent.press(getByTestId('log-set-button'))
    expect(logSetSpy).toHaveBeenCalledWith(10, 0)
  })

  it('displays logged sets for the current exercise', () => {
    act(() => {
      useWorkoutStore.getState().logSet(10, 50)
      useWorkoutStore.getState().logSet(8, 50)
    })
    const { getByText } = render(<SetLogger />)
    expect(getByText(/Set 1/)).toBeTruthy()
    expect(getByText(/Set 2/)).toBeTruthy()
  })
})
