export type PlanType = 'upper' | 'lower' | 'full' | 'custom'

export interface SetLog {
  reps: number
  weightKg: number | null // null for bodyweight
  completed: boolean
}

export interface ExerciseLog {
  exerciseId: string
  exerciseName: string
  sets: SetLog[]
  order: number
}

export interface WorkoutState {
  planType: PlanType | null
  exercises: ExerciseLog[]
  currentExerciseIndex: number
  isActive: boolean
  startTime: number | null // unix ms
}

// Local Exercise type — will be reconciled with features/exercises when Slice 2-3 land
export interface Exercise {
  id: string
  name: string
  equipment: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  imageUrl?: string | null
}
