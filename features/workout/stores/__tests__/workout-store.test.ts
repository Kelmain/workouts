import { act } from '@testing-library/react-native'
import { useWorkoutStore } from '../workout-store'
import type { Exercise } from '../../types'

function makeExercise(id: string, name: string): Exercise {
  return { id, name, equipment: null, primaryMuscles: ['chest'], secondaryMuscles: [] }
}

const exercises: Exercise[] = [
  makeExercise('ex1', 'Push-up'),
  makeExercise('ex2', 'Pull-up'),
  makeExercise('ex3', 'Squat'),
]

// Reset store between tests
beforeEach(() => {
  act(() => {
    useWorkoutStore.getState().resetWorkout()
  })
})

describe('startWorkout', () => {
  it('initializes state with provided exercises', () => {
    act(() => {
      useWorkoutStore.getState().startWorkout('upper', exercises)
    })

    const state = useWorkoutStore.getState()
    expect(state.isActive).toBe(true)
    expect(state.planType).toBe('upper')
    expect(state.exercises).toHaveLength(3)
    expect(state.exercises[0].exerciseId).toBe('ex1')
    expect(state.exercises[0].exerciseName).toBe('Push-up')
    expect(state.exercises[0].sets).toHaveLength(0)
    expect(state.exercises[0].order).toBe(0)
    expect(state.currentExerciseIndex).toBe(0)
    expect(state.startTime).not.toBeNull()
  })

  it('records startTime as a number (unix ms)', () => {
    const before = Date.now()
    act(() => {
      useWorkoutStore.getState().startWorkout('lower', exercises)
    })
    const after = Date.now()
    const { startTime } = useWorkoutStore.getState()
    expect(startTime).toBeGreaterThanOrEqual(before)
    expect(startTime).toBeLessThanOrEqual(after)
  })

  it('assigns correct order to each exercise', () => {
    act(() => {
      useWorkoutStore.getState().startWorkout('full', exercises)
    })
    const { exercises: exLogs } = useWorkoutStore.getState()
    expect(exLogs[0].order).toBe(0)
    expect(exLogs[1].order).toBe(1)
    expect(exLogs[2].order).toBe(2)
  })
})

describe('logSet', () => {
  beforeEach(() => {
    act(() => {
      useWorkoutStore.getState().startWorkout('upper', exercises)
    })
  })

  it('adds a set to the current exercise', () => {
    act(() => {
      useWorkoutStore.getState().logSet(10, 0)
    })
    const { exercises: exLogs } = useWorkoutStore.getState()
    expect(exLogs[0].sets).toHaveLength(1)
    expect(exLogs[0].sets[0]).toEqual({ reps: 10, weightKg: 0, completed: true })
  })

  it('accumulates multiple sets on the same exercise', () => {
    act(() => {
      useWorkoutStore.getState().logSet(10, 0)
      useWorkoutStore.getState().logSet(8, 20)
    })
    const { exercises: exLogs } = useWorkoutStore.getState()
    expect(exLogs[0].sets).toHaveLength(2)
    expect(exLogs[0].sets[1]).toEqual({ reps: 8, weightKg: 20, completed: true })
  })

  it('accepts null weightKg for bodyweight exercises', () => {
    act(() => {
      useWorkoutStore.getState().logSet(12, null)
    })
    const { exercises: exLogs } = useWorkoutStore.getState()
    expect(exLogs[0].sets[0].weightKg).toBeNull()
  })

  it('logs set to the current exercise (not the first one)', () => {
    act(() => {
      useWorkoutStore.getState().nextExercise()
      useWorkoutStore.getState().logSet(5, 10)
    })
    const { exercises: exLogs } = useWorkoutStore.getState()
    expect(exLogs[0].sets).toHaveLength(0)
    expect(exLogs[1].sets).toHaveLength(1)
  })
})

describe('nextExercise', () => {
  beforeEach(() => {
    act(() => {
      useWorkoutStore.getState().startWorkout('upper', exercises)
    })
  })

  it('increments currentExerciseIndex', () => {
    act(() => {
      useWorkoutStore.getState().nextExercise()
    })
    expect(useWorkoutStore.getState().currentExerciseIndex).toBe(1)
  })

  it('does not go beyond last exercise', () => {
    act(() => {
      useWorkoutStore.getState().nextExercise()
      useWorkoutStore.getState().nextExercise()
      useWorkoutStore.getState().nextExercise() // would be index 3, should stay at 2
    })
    expect(useWorkoutStore.getState().currentExerciseIndex).toBe(2)
  })
})

describe('previousExercise', () => {
  beforeEach(() => {
    act(() => {
      useWorkoutStore.getState().startWorkout('upper', exercises)
    })
  })

  it('decrements currentExerciseIndex', () => {
    act(() => {
      useWorkoutStore.getState().nextExercise()
      useWorkoutStore.getState().previousExercise()
    })
    expect(useWorkoutStore.getState().currentExerciseIndex).toBe(0)
  })

  it('does not go below 0', () => {
    act(() => {
      useWorkoutStore.getState().previousExercise()
    })
    expect(useWorkoutStore.getState().currentExerciseIndex).toBe(0)
  })
})

describe('finishWorkout', () => {
  it('sets isActive to false', () => {
    act(() => {
      useWorkoutStore.getState().startWorkout('upper', exercises)
      useWorkoutStore.getState().finishWorkout()
    })
    expect(useWorkoutStore.getState().isActive).toBe(false)
  })

  it('preserves exercises and sets after finishing', () => {
    act(() => {
      useWorkoutStore.getState().startWorkout('upper', exercises)
      useWorkoutStore.getState().logSet(10, 0)
      useWorkoutStore.getState().finishWorkout()
    })
    const { exercises: exLogs } = useWorkoutStore.getState()
    expect(exLogs[0].sets).toHaveLength(1)
  })
})

describe('resetWorkout', () => {
  it('clears all state back to initial', () => {
    act(() => {
      useWorkoutStore.getState().startWorkout('upper', exercises)
      useWorkoutStore.getState().logSet(10, 50)
      useWorkoutStore.getState().resetWorkout()
    })
    const state = useWorkoutStore.getState()
    expect(state.isActive).toBe(false)
    expect(state.exercises).toHaveLength(0)
    expect(state.currentExerciseIndex).toBe(0)
    expect(state.startTime).toBeNull()
    expect(state.planType).toBeNull()
  })
})
