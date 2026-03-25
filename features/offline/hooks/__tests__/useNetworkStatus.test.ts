/**
 * TDD tests for useNetworkStatus hook.
 * Tests drive:
 *   - Returns isOnline from NetInfo
 *   - Updates when network state changes
 */

import { renderHook, act } from '@testing-library/react-native'
import { useNetworkStatus } from '../useNetworkStatus'
import NetInfo from '@react-native-community/netinfo'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('useNetworkStatus', () => {
  it('returns online by default', () => {
    const { result } = renderHook(() => useNetworkStatus())
    expect(result.current.isOnline).toBe(true)
  })

  it('updates when going offline', () => {
    const { result } = renderHook(() => useNetworkStatus())

    // Get the callback registered via addEventListener
    const callback = (NetInfo.addEventListener as jest.Mock).mock.calls[0][0]

    act(() => {
      callback({ isConnected: false })
    })

    expect(result.current.isOnline).toBe(false)
  })

  it('updates when coming back online', () => {
    const { result } = renderHook(() => useNetworkStatus())

    const callback = (NetInfo.addEventListener as jest.Mock).mock.calls[0][0]

    act(() => {
      callback({ isConnected: false })
    })
    act(() => {
      callback({ isConnected: true })
    })

    expect(result.current.isOnline).toBe(true)
  })
})
