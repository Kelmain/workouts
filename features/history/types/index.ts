import type { PlanType, ExerciseLog } from '@/features/workout/types'

export interface WorkoutLog {
  id: string
  date: Date
  planType: PlanType
  durationSeconds: number
  exercises: ExerciseLog[]
  notes: string | null
}

export interface HistoryQueryOptions {
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

export interface DashboardStats {
  workoutsThisWeek: number
  workoutsThisMonth: number
  currentStreak: number
  totalTimeMinutes: number
}

export interface ExerciseProgressEntry {
  exerciseId: string
  exerciseName: string
  firstLog: {
    date: Date
    maxWeightKg: number | null
    maxReps: number
  }
  latestLog: {
    date: Date
    maxWeightKg: number | null
    maxReps: number
  }
  improved: boolean
}
