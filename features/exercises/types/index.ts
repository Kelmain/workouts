export interface Exercise {
  id: string
  name: string
  force: string | null
  level: string | null // "beginner" | "intermediate" | "expert"
  mechanic: string | null
  equipment: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  category: string
  images: string[]
}

export interface ExerciseFilter {
  equipment?: string[]
  search?: string
  muscleGroup?: string
  level?: string
  force?: string
}
