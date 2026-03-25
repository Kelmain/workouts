/**
 * TDD tests for OfflineBanner component.
 * Tests drive:
 *   - Shows banner when offline
 *   - Hides banner when online
 */

import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { OfflineBanner } from '../OfflineBanner'

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

describe('OfflineBanner', () => {
  it('shows offline message when isOnline is false', () => {
    render(<OfflineBanner isOnline={false} />)
    expect(screen.getByText(/offline/i)).toBeTruthy()
  })

  it('renders nothing when online', () => {
    render(<OfflineBanner isOnline={true} />)
    expect(screen.queryByText(/offline/i)).toBeNull()
  })
})
