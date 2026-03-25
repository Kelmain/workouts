/**
 * TDD tests for DraftPrompt component.
 * Tests drive:
 *   - Renders modal when draft exists (hasDraft prop is true)
 *   - "Resume" button calls onResume callback
 *   - "Discard" button calls onDiscard callback
 *   - Does not render modal when no draft (hasDraft prop is false)
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { DraftPrompt } from '../DraftPrompt'

describe('DraftPrompt', () => {
  it('shows prompt when hasDraft is true', () => {
    const { getByText } = render(
      <DraftPrompt hasDraft={true} onResume={jest.fn()} onDiscard={jest.fn()} />
    )
    expect(getByText(/Resume workout/i)).toBeTruthy()
  })

  it('"Resume" button calls onResume callback', () => {
    const onResume = jest.fn()
    const { getByTestId } = render(
      <DraftPrompt hasDraft={true} onResume={onResume} onDiscard={jest.fn()} />
    )
    fireEvent.press(getByTestId('draft-resume-button'))
    expect(onResume).toHaveBeenCalledTimes(1)
  })

  it('"Discard" button calls onDiscard callback', () => {
    const onDiscard = jest.fn()
    const { getByTestId } = render(
      <DraftPrompt hasDraft={true} onResume={jest.fn()} onDiscard={onDiscard} />
    )
    fireEvent.press(getByTestId('draft-discard-button'))
    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('does not show prompt when hasDraft is false', () => {
    const { queryByText } = render(
      <DraftPrompt hasDraft={false} onResume={jest.fn()} onDiscard={jest.fn()} />
    )
    expect(queryByText(/Resume workout/i)).toBeNull()
  })
})
