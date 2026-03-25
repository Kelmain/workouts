/**
 * TDD tests for useEquipment hook.
 * Tests drive the implementation of:
 *   - Returns equipment array and loading state
 *   - Provides updateEquipment function
 */

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({ get: jest.fn(), update: jest.fn() })),
    })),
  })),
}))

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ onAuthStateChanged: jest.fn() })),
}))

jest.mock('../../services/equipment-service', () => ({
  getEquipment: jest.fn(),
  updateEquipment: jest.fn(),
}))

jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}))

import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEquipment } from '../useEquipment'
import { getEquipment, updateEquipment } from '../../services/equipment-service'
import { useAuth } from '@/features/auth/hooks/useAuth'

const mockGetEquipment = getEquipment as jest.Mock
const mockUpdateEquipment = updateEquipment as jest.Mock
const mockUseAuth = useAuth as jest.Mock

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useEquipment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns loading true initially', () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'uid-1' }, loading: false })
    mockGetEquipment.mockResolvedValue(['Kettlebells'])

    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() })

    expect(result.current.loading).toBe(true)
  })

  it('returns equipment array after loading', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'uid-1' }, loading: false })
    mockGetEquipment.mockResolvedValue(['Kettlebells', 'Pull-up bar'])

    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.equipment).toEqual(['Kettlebells', 'Pull-up bar'])
  })

  it('returns empty array when user has no equipment', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'uid-1' }, loading: false })
    mockGetEquipment.mockResolvedValue([])

    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.equipment).toEqual([])
  })

  it('returns empty array when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })

    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.equipment).toEqual([])
  })

  it('provides an updateEquipment function', () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'uid-1' }, loading: false })
    mockGetEquipment.mockResolvedValue([])

    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() })

    expect(typeof result.current.updateEquipment).toBe('function')
  })

  it('calls equipment service updateEquipment with uid and new list', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'uid-1' }, loading: false })
    mockGetEquipment.mockResolvedValue([])
    mockUpdateEquipment.mockResolvedValue(undefined)

    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.updateEquipment(['Kettlebells'])
    })

    expect(mockUpdateEquipment).toHaveBeenCalledWith('uid-1', ['Kettlebells'])
  })
})
