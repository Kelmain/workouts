import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ExerciseLog, PlanType } from '../types'

const DRAFT_KEY = '@workout_draft'

export interface WorkoutDraft {
  planType: PlanType
  startTime: number       // unix ms
  elapsedSeconds: number  // elapsed at save
  exercises: ExerciseLog[]
  currentExerciseIndex: number
  savedAt: number         // unix ms
}

export async function saveDraft(state: WorkoutDraft): Promise<void> {
  await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(state))
}

export async function loadDraft(): Promise<WorkoutDraft | null> {
  const value = await AsyncStorage.getItem(DRAFT_KEY)
  if (value === null) return null
  return JSON.parse(value) as WorkoutDraft
}

export async function deleteDraft(): Promise<void> {
  await AsyncStorage.removeItem(DRAFT_KEY)
}

export async function hasDraft(): Promise<boolean> {
  const value = await AsyncStorage.getItem(DRAFT_KEY)
  return value !== null
}
