import auth, { GoogleAuthProvider, type FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { serverTimestamp } from '@react-native-firebase/firestore'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { DEFAULT_REST_DURATION_SECONDS, FIRESTORE_COLLECTIONS } from '@/shared/lib/constants'

/**
 * Sign in with Google via Firebase Authentication.
 * Calls GoogleSignin.hasPlayServices → GoogleSignin.signIn → Firebase credential sign-in.
 *
 * @throws Error if Google Play Services unavailable, sign-in is cancelled, or Firebase fails.
 */
export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
  const signInResult = await GoogleSignin.signIn()

  const idToken = signInResult.data?.idToken
  if (!idToken) {
    throw new Error('No ID token returned from Google Sign-In')
  }

  const credential = GoogleAuthProvider.credential(idToken)
  return auth().signInWithCredential(credential)
}

/**
 * Sign out from both Firebase and Google.
 *
 * @throws Error if Firebase sign-out fails.
 */
export async function signOut(): Promise<void> {
  await auth().signOut()
  await GoogleSignin.signOut()
}

/**
 * Subscribe to Firebase auth state changes.
 *
 * @param callback Called with the current user or null when auth state changes.
 * @returns Unsubscribe function to stop listening.
 */
export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void
): () => void {
  return auth().onAuthStateChanged(callback)
}

/**
 * Create a Firestore user document on first login.
 * Does nothing if the document already exists (returning users).
 *
 * @param user The authenticated Firebase user.
 */
export async function createUserDocumentIfNeeded(user: FirebaseAuthTypes.User): Promise<void> {
  const userDocRef = firestore()
    .collection(FIRESTORE_COLLECTIONS.USERS)
    .doc(user.uid)

  const snapshot = await userDocRef.get()
  // @ts-expect-error -- RN Firebase snapshot.exists is a property, not a method
  if (snapshot.exists) {
    return
  }

  await userDocRef.set({
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    equipment: [],
    createdAt: serverTimestamp(),
    lastWorkoutDate: null,
    defaultRestDuration: DEFAULT_REST_DURATION_SECONDS,
  })
}
