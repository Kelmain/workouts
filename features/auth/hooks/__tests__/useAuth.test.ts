/**
 * TDD tests for useAuth hook.
 * These tests drive the implementation of auth state transitions:
 *   - loading → authenticated
 *   - loading → unauthenticated
 *   - sign-in success
 *   - sign-in error
 */

jest.mock('@react-native-firebase/auth', () => {
  const mockOnAuthStateChanged = jest.fn()

  return {
    __esModule: true,
    default: jest.fn(() => ({
      onAuthStateChanged: mockOnAuthStateChanged,
    })),
    GoogleAuthProvider: {
      credential: jest.fn(),
    },
  }
})

jest.mock('@react-native-firebase/firestore', () => {
  const mockGet = jest.fn()
  const mockSet = jest.fn()
  const mockDoc = jest.fn(() => ({ get: mockGet, set: mockSet }))
  const mockCollection = jest.fn(() => ({ doc: mockDoc }))

  return {
    __esModule: true,
    default: jest.fn(() => ({ collection: mockCollection })),
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

// Mock the firebase-auth service (system boundary)
jest.mock('../../services/firebase-auth', () => ({
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  createUserDocumentIfNeeded: jest.fn(),
}))

import { renderHook, act } from '@testing-library/react-native'
import {
  signInWithGoogle as mockSignInWithGoogle,
  signOut as mockSignOut,
  onAuthStateChanged as mockOnAuthStateChanged,
  createUserDocumentIfNeeded as mockCreateUserDoc,
} from '../../services/firebase-auth'
import { useAuth } from '../useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should start in loading state', () => {
    // onAuthStateChanged never calls back during this test
    ;(mockOnAuthStateChanged as jest.Mock).mockReturnValue(jest.fn())

    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should transition to authenticated when user is present', async () => {
    const mockUser = { uid: 'test-uid', displayName: 'Test User', email: 'test@example.com' }

    ;(mockOnAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      // Simulate Firebase calling back with a user
      callback(mockUser)
      return jest.fn() // unsubscribe
    })
    ;(mockCreateUserDoc as jest.Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useAuth())

    // Wait for async state updates
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.error).toBeNull()
  })

  it('should transition to unauthenticated when user is null', async () => {
    ;(mockOnAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      callback(null)
      return jest.fn()
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should call createUserDocumentIfNeeded when a user logs in', async () => {
    const mockUser = { uid: 'test-uid', displayName: 'Test User', email: 'test@example.com' }

    ;(mockOnAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      callback(mockUser)
      return jest.fn()
    })
    ;(mockCreateUserDoc as jest.Mock).mockResolvedValue(undefined)

    renderHook(() => useAuth())

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockCreateUserDoc).toHaveBeenCalledWith(mockUser)
  })

  it('should NOT call createUserDocumentIfNeeded when user is null (logout)', async () => {
    ;(mockOnAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      callback(null)
      return jest.fn()
    })

    renderHook(() => useAuth())

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockCreateUserDoc).not.toHaveBeenCalled()
  })

  it('should expose signIn function that calls signInWithGoogle', async () => {
    ;(mockOnAuthStateChanged as jest.Mock).mockReturnValue(jest.fn())
    ;(mockSignInWithGoogle as jest.Mock).mockResolvedValue({ user: { uid: 'abc' } })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn()
    })

    expect(mockSignInWithGoogle).toHaveBeenCalled()
  })

  it('should set error when signIn fails', async () => {
    ;(mockOnAuthStateChanged as jest.Mock).mockReturnValue(jest.fn())
    ;(mockSignInWithGoogle as jest.Mock).mockRejectedValue(new Error('Sign-in failed'))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn()
    })

    expect(result.current.error).toEqual(new Error('Sign-in failed'))
  })

  it('should expose signOut function that calls signOut service', async () => {
    ;(mockOnAuthStateChanged as jest.Mock).mockReturnValue(jest.fn())
    ;(mockSignOut as jest.Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSignOut).toHaveBeenCalled()
  })

  it('should unsubscribe from auth state changes on unmount', () => {
    const mockUnsubscribe = jest.fn()
    ;(mockOnAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe)

    const { unmount } = renderHook(() => useAuth())

    unmount()

    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
