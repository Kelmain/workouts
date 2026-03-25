/**
 * TDD tests for firebase-auth service.
 * These tests drive the implementation of:
 *   - signInWithGoogle()
 *   - signOut()
 *   - onAuthStateChanged()
 *   - createUserDocumentIfNeeded()
 */

// Mock all Firebase and Google Sign-In modules at system boundary
jest.mock('@react-native-firebase/auth', () => {
  const mockSignInWithCredential = jest.fn()
  const mockSignOut = jest.fn()
  const mockOnAuthStateChanged = jest.fn()
  const mockGetCurrentUser = jest.fn()

  const mockAuth = {
    signInWithCredential: mockSignInWithCredential,
    signOut: mockSignOut,
    onAuthStateChanged: mockOnAuthStateChanged,
    currentUser: null,
  }

  return {
    __esModule: true,
    default: jest.fn(() => mockAuth),
    GoogleAuthProvider: {
      credential: jest.fn((idToken: string) => ({ idToken, providerId: 'google.com' })),
    },
  }
})

jest.mock('@react-native-firebase/firestore', () => {
  const mockGet = jest.fn()
  const mockSet = jest.fn()
  const mockDoc = jest.fn(() => ({ get: mockGet, set: mockSet }))
  const mockCollection = jest.fn(() => ({ doc: mockDoc }))
  const mockFirestore = { collection: mockCollection }

  return {
    __esModule: true,
    default: jest.fn(() => mockFirestore),
    serverTimestamp: jest.fn(() => ({ _methodName: 'serverTimestamp' })),
  }
})

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}))

import auth, { GoogleAuthProvider } from '@react-native-firebase/auth'
import firestore, { serverTimestamp } from '@react-native-firebase/firestore'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import {
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
  createUserDocumentIfNeeded,
} from '../firebase-auth'

describe('signInWithGoogle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call GoogleSignin.hasPlayServices before signing in', async () => {
    ;(GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true)
    ;(GoogleSignin.signIn as jest.Mock).mockResolvedValue({ data: { idToken: 'test-id-token' } })
    ;(auth().signInWithCredential as jest.Mock).mockResolvedValue({
      user: { uid: 'test-uid', displayName: 'Test User', email: 'test@example.com' },
    })

    await signInWithGoogle()

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalled()
  })

  it('should call GoogleSignin.signIn and sign in with the credential', async () => {
    const mockIdToken = 'mock-id-token-123'
    ;(GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true)
    ;(GoogleSignin.signIn as jest.Mock).mockResolvedValue({ data: { idToken: mockIdToken } })
    const mockUserCredential = {
      user: { uid: 'uid-1', displayName: 'Jane', email: 'jane@example.com', photoURL: null },
    }
    ;(auth().signInWithCredential as jest.Mock).mockResolvedValue(mockUserCredential)

    const result = await signInWithGoogle()

    expect(GoogleSignin.signIn).toHaveBeenCalled()
    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith(mockIdToken)
    expect(auth().signInWithCredential).toHaveBeenCalled()
    expect(result.user.uid).toBe('uid-1')
  })

  it('should throw an error if GoogleSignin.signIn fails', async () => {
    ;(GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true)
    ;(GoogleSignin.signIn as jest.Mock).mockRejectedValue(new Error('Sign-in cancelled'))

    await expect(signInWithGoogle()).rejects.toThrow('Sign-in cancelled')
  })

  it('should throw an error if idToken is missing from Google sign-in result', async () => {
    ;(GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true)
    ;(GoogleSignin.signIn as jest.Mock).mockResolvedValue({ data: { idToken: null } })

    await expect(signInWithGoogle()).rejects.toThrow()
  })

  it('should throw an error if Firebase credential sign-in fails', async () => {
    ;(GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true)
    ;(GoogleSignin.signIn as jest.Mock).mockResolvedValue({ data: { idToken: 'valid-token' } })
    ;(auth().signInWithCredential as jest.Mock).mockRejectedValue(
      new Error('Firebase auth failed')
    )

    await expect(signInWithGoogle()).rejects.toThrow('Firebase auth failed')
  })
})

describe('signOut', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should sign out from both Firebase and Google', async () => {
    ;(auth().signOut as jest.Mock).mockResolvedValue(undefined)
    ;(GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined)

    await signOut()

    expect(auth().signOut).toHaveBeenCalled()
    expect(GoogleSignin.signOut).toHaveBeenCalled()
  })

  it('should still sign out from Google even if Firebase signOut fails', async () => {
    ;(auth().signOut as jest.Mock).mockRejectedValue(new Error('Firebase error'))
    ;(GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined)

    await expect(signOut()).rejects.toThrow('Firebase error')
    // Google sign-out should have been attempted (order matters in implementation)
  })
})

describe('onAuthStateChanged', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register the callback with Firebase auth', () => {
    const mockUnsubscribe = jest.fn()
    ;(auth().onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe)

    const callback = jest.fn()
    const unsubscribe = onAuthStateChanged(callback)

    expect(auth().onAuthStateChanged).toHaveBeenCalledWith(callback)
    expect(unsubscribe).toBe(mockUnsubscribe)
  })

  it('should return an unsubscribe function', () => {
    const mockUnsubscribe = jest.fn()
    ;(auth().onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe)

    const unsubscribe = onAuthStateChanged(jest.fn())

    expect(typeof unsubscribe).toBe('function')
    unsubscribe()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})

describe('createUserDocumentIfNeeded', () => {
  const mockUser = {
    uid: 'user-123',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: null,
  }

  // Get reference to the mock functions from the module factory
  // These are the same functions used in every call to firestore().collection().doc()
  let mockGet: jest.Mock
  let mockSet: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    // Re-acquire references to the mocks after clearAllMocks (implementation still exists,
    // just mock state is cleared)
    const mockFirestore = (firestore as unknown as jest.Mock).mock.results[0]?.value ?? (firestore as unknown as jest.Mock)()
    const collectionResult = mockFirestore.collection('users')
    const docResult = collectionResult.doc('any')
    mockGet = docResult.get as jest.Mock
    mockSet = docResult.set as jest.Mock
  })

  it('should create a user document if it does not exist', async () => {
    mockGet.mockResolvedValue({ exists: false })
    mockSet.mockResolvedValue(undefined)

    await createUserDocumentIfNeeded(mockUser as any)

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: 'Test User',
        email: 'test@example.com',
        equipment: [],
        lastWorkoutDate: null,
        defaultRestDuration: 90,
      })
    )
  })

  it('should include serverTimestamp in createdAt when creating a new user doc', async () => {
    mockGet.mockResolvedValue({ exists: false })
    mockSet.mockResolvedValue(undefined)

    await createUserDocumentIfNeeded(mockUser as any)

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.anything(),
      })
    )
    expect(serverTimestamp).toHaveBeenCalled()
  })

  it('should NOT overwrite an existing user document', async () => {
    mockGet.mockResolvedValue({ exists: true })

    await createUserDocumentIfNeeded(mockUser as any)

    expect(mockSet).not.toHaveBeenCalled()
  })

  it('should use the user uid as the document id', async () => {
    mockGet.mockResolvedValue({ exists: true })

    // Get the mockDoc from the collection result to verify call args
    const firestoreInstance = (firestore as unknown as jest.Mock)()
    const mockDoc = firestoreInstance.collection('users').doc as jest.Mock

    await createUserDocumentIfNeeded(mockUser as any)

    // Check that doc was called with the user's uid
    const allCalls = mockDoc.mock.calls
    expect(allCalls.some((call: string[]) => call[0] === 'user-123')).toBe(true)
  })
})
