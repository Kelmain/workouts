import { create } from 'zustand'
import type { Exercise, ExerciseLog, SetLog, WorkoutState, PlanType } from '../types'

interface WorkoutActions {
  startWorkout: (planType: PlanType, exercises: Exercise[]) => void
  logSet: (reps: number, weightKg: number | null) => void
  nextExercise: () => void
  previousExercise: () => void
  finishWorkout: () => void
  resetWorkout: () => void
}

type WorkoutStore = WorkoutState & WorkoutActions

const initialState: WorkoutState = {
  planType: null,
  exercises: [],
  currentExerciseIndex: 0,
  isActive: false,
  startTime: null,
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  ...initialState,

  startWorkout(planType: PlanType, exercises: Exercise[]) {
    const exerciseLogs: ExerciseLog[] = exercises.map((ex, index) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: [],
      order: index,
    }))
    set({
      planType,
      exercises: exerciseLogs,
      currentExerciseIndex: 0,
      isActive: true,
      startTime: Date.now(),
    })
  },

  logSet(reps: number, weightKg: number | null) {
    const { exercises, currentExerciseIndex } = get()
    const newSet: SetLog = { reps, weightKg, completed: true }
    const updated = exercises.map((ex, index) => {
      if (index === currentExerciseIndex) {
        return { ...ex, sets: [...ex.sets, newSet] }
      }
      return ex
    })
    set({ exercises: updated })
  },

  nextExercise() {
    const { currentExerciseIndex, exercises } = get()
    if (currentExerciseIndex < exercises.length - 1) {
      set({ currentExerciseIndex: currentExerciseIndex + 1 })
    }
  },

  previousExercise() {
    const { currentExerciseIndex } = get()
    if (currentExerciseIndex > 0) {
      set({ currentExerciseIndex: currentExerciseIndex - 1 })
    }
  },

  finishWorkout() {
    set({ isActive: false })
  },

  resetWorkout() {
    set({ ...initialState })
  },
}))
