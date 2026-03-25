import firestore from '@react-native-firebase/firestore'
import { FIRESTORE_COLLECTIONS } from '@/shared/lib/constants'

/**
 * Fetch the equipment array for a given user.
 *
 * @param uid - Firebase user ID
 * @returns Array of equipment strings, or empty array if not found.
 */
export async function getEquipment(uid: string): Promise<string[]> {
  const snapshot = await firestore()
    .collection(FIRESTORE_COLLECTIONS.USERS)
    .doc(uid)
    .get()

  if (!snapshot.exists) {
    return []
  }

  const data = snapshot.data()
  return data?.equipment ?? []
}

/**
 * Overwrite the equipment array for a given user.
 *
 * @param uid - Firebase user ID
 * @param equipment - New equipment list to persist.
 */
export async function updateEquipment(uid: string, equipment: string[]): Promise<void> {
  await firestore()
    .collection(FIRESTORE_COLLECTIONS.USERS)
    .doc(uid)
    .update({ equipment })
}
