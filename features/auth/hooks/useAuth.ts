import { useEffect, useState } from 'react'
import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import {
  signInWithGoogle,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserDocumentIfNeeded,
} from '../services/firebase-auth'

interface AuthState {
  user: FirebaseAuthTypes.User | null
  loading: boolean
  error: Error | null
}

interface UseAuthReturn extends AuthState {
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

/**
 * Hook that subscribes to Firebase auth state and exposes sign-in/sign-out actions.
 *
 * - loading: true until Firebase has resolved the initial auth state
 * - user: the authenticated Firebase user, or null
 * - error: set when signIn fails, cleared on next signIn attempt
 * - signIn: triggers Google Sign-In flow
 * - signOut: signs out from Firebase and Google
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        await createUserDocumentIfNeeded(user)
      }
      setState((prev) => ({ ...prev, user, loading: false }))
    })

    return unsubscribe
  }, [])

  async function handleSignIn(): Promise<void> {
    setState((prev) => ({ ...prev, error: null }))
    try {
      await signInWithGoogle()
    } catch (err) {
      setState((prev) => ({ ...prev, error: err instanceof Error ? err : new Error(String(err)) }))
    }
  }

  async function handleSignOut(): Promise<void> {
    await firebaseSignOut()
  }

  return {
    ...state,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }
}
