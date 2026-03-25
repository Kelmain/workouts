import firestore from '@react-native-firebase/firestore'
import type { WorkoutLog, HistoryQueryOptions } from '../types'

const DEFAULT_LIMIT = 50

export async function getWorkoutHistory(
  uid: string,
  options?: HistoryQueryOptions
): Promise<WorkoutLog[]> {
  const limit = options?.limit ?? DEFAULT_LIMIT

  let query = firestore()
    .collection(`users/${uid}/workoutLogs`)
    .orderBy('date', 'desc')

  if (options?.dateFrom) {
    query = query.where('date', '>=', options.dateFrom) as typeof query
  }
  if (options?.dateTo) {
    query = query.where('date', '<=', options.dateTo) as typeof query
  }

  const snapshot = await query.limit(limit).get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      date: data.date.toDate(),
      planType: data.planType,
      durationSeconds: data.durationSeconds,
      exercises: data.exercises,
      notes: data.notes ?? null,
    }
  })
}
