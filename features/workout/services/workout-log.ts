import firestore, { serverTimestamp } from '@react-native-firebase/firestore'

export interface WorkoutLogData {
  date: Date
  planType: string
  durationSeconds: number
  exercises: Array<{
    exerciseId: string
    exerciseName: string
    sets: Array<{ reps: number; weightKg: number | null; completed: boolean }>
    order: number
  }>
  notes: string | null
}

export async function saveWorkoutLog(
  uid: string,
  data: WorkoutLogData
): Promise<string> {
  const db = firestore()
  const batch = db.batch()

  const workoutLogDocRef = db
    .collection(`users/${uid}/workoutLogs`)
    .doc()

  const userDocRef = db.collection('users').doc(uid)

  batch.set(workoutLogDocRef, {
    date: data.date,
    planType: data.planType,
    durationSeconds: data.durationSeconds,
    exercises: data.exercises,
    notes: data.notes,
    createdAt: serverTimestamp(),
  })

  batch.update(userDocRef, {
    lastWorkoutDate: serverTimestamp(),
  })

  await batch.commit()

  return workoutLogDocRef.id
}
