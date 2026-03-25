import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export interface UserDocument {
  displayName: string
  email: string
  equipment: string[]
  createdAt: FirebaseFirestoreTypes.FieldValue | FirebaseFirestoreTypes.Timestamp
  lastWorkoutDate: FirebaseFirestoreTypes.Timestamp | null
  defaultRestDuration: number
}

export interface AuthUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}
