/**
 * TDD tests for AuthGuard component.
 * Tests:
 *   - Redirects to /(auth)/login when unauthenticated
 *   - Renders children when authenticated
 *   - Shows nothing (or loading indicator) while auth is loading
 */

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ onAuthStateChanged: jest.fn() })),
  GoogleAuthProvider: { credential: jest.fn() },
}))

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: jest.fn(() => ({ doc: jest.fn(() => ({ get: jest.fn(), set: jest.fn() })) })),
  })),
  serverTimestamp: jest.fn(),
}))

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}))

// Mock expo-router
const mockReplace = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ replace: mockReplace })),
  useSegments: jest.fn(() => []),
}))

// Mock the useAuth hook — it is an internal abstraction, not a system boundary,
// but we use it as the interface between AuthGuard and auth state.
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

// Mock useEquipment to avoid Firestore and TanStack Query setup in these tests.
jest.mock('@/features/equipment/hooks/useEquipment', () => ({
  useEquipment: jest.fn(() => ({ equipment: ['Body only'], loading: false, updateEquipment: jest.fn() })),
}))

import React from 'react'
import { Text } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { useAuth } from '../../hooks/useAuth'
import { AuthGuard } from '../AuthGuard'

const mockUseAuth = useAuth as jest.Mock

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-uid', email: 'test@example.com' },
      loading: false,
      error: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    })

    render(
      <AuthGuard>
        <Text>Protected Content</Text>
      </AuthGuard>
    )

    expect(screen.getByText('Protected Content')).toBeTruthy()
  })

  it('should redirect to login when user is unauthenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    })

    render(
      <AuthGuard>
        <Text>Protected Content</Text>
      </AuthGuard>
    )

    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login')
  })

  it('should NOT render children when redirecting to login', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    })

    render(
      <AuthGuard>
        <Text>Protected Content</Text>
      </AuthGuard>
    )

    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('should render nothing while auth is loading (prevents flash)', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    })

    const { toJSON } = render(
      <AuthGuard>
        <Text>Protected Content</Text>
      </AuthGuard>
    )

    // While loading, children should not be shown
    expect(screen.queryByText('Protected Content')).toBeNull()
    // And no redirect yet
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should NOT redirect while auth state is still loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    })

    render(
      <AuthGuard>
        <Text>Protected Content</Text>
      </AuthGuard>
    )

    expect(mockReplace).not.toHaveBeenCalled()
  })
})
