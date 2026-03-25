/**
 * TDD tests for ErrorBoundary component.
 * Tests drive:
 *   - Renders children normally when no error
 *   - Catches errors and shows fallback UI
 *   - Shows retry button that attempts to recover
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { ErrorBoundary } from '../ErrorBoundary'

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

// Suppress error boundary console.error in tests
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})
afterAll(() => {
  console.error = originalError
})

function GoodChild() {
  return <Text>All good</Text>
}

function BadChild(): never {
  throw new Error('Test crash')
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    )

    expect(screen.getByText('All good')).toBeTruthy()
  })

  it('shows error message when child throws', () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeTruthy()
  })

  it('shows retry button', () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>
    )

    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy()
  })
})
