/**
 * TDD tests for RestTimerPicker component.
 * Tests drive:
 *   - Renders preset buttons (30, 60, 90, 120, 180)
 *   - Highlights currently selected preset
 *   - Calls onSelect with preset value when tapped
 *   - Renders custom input field
 *   - Custom input validates 10-600 range
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { RestTimerPicker } from '../RestTimerPicker'

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}))

const PRESETS = [30, 60, 90, 120, 180]

describe('RestTimerPicker', () => {
  it('renders all preset buttons', () => {
    render(<RestTimerPicker value={90} onSelect={jest.fn()} />)

    for (const preset of PRESETS) {
      const testId =
        preset === 90
          ? `rest-preset-${preset}-selected`
          : `rest-preset-${preset}`
      expect(screen.getByTestId(testId)).toBeTruthy()
    }
  })

  it('highlights the currently selected preset', () => {
    render(<RestTimerPicker value={90} onSelect={jest.fn()} />)

    expect(screen.getByTestId('rest-preset-90-selected')).toBeTruthy()
  })

  it('calls onSelect with preset value when tapped', () => {
    const onSelect = jest.fn()
    render(<RestTimerPicker value={90} onSelect={onSelect} />)

    fireEvent.press(screen.getByTestId('rest-preset-60'))

    expect(onSelect).toHaveBeenCalledWith(60)
  })

  it('renders custom input field', () => {
    render(<RestTimerPicker value={90} onSelect={jest.fn()} />)

    expect(screen.getByPlaceholderText(/custom/i)).toBeTruthy()
  })

  it('applies valid custom value on submit', () => {
    const onSelect = jest.fn()
    render(<RestTimerPicker value={90} onSelect={onSelect} />)

    const input = screen.getByPlaceholderText(/custom/i)
    fireEvent.changeText(input, '45')
    fireEvent(input, 'submitEditing')

    expect(onSelect).toHaveBeenCalledWith(45)
  })

  it('ignores invalid custom value', () => {
    const onSelect = jest.fn()
    render(<RestTimerPicker value={90} onSelect={onSelect} />)

    const input = screen.getByPlaceholderText(/custom/i)
    fireEvent.changeText(input, '5')
    fireEvent(input, 'submitEditing')

    expect(onSelect).not.toHaveBeenCalled()
  })
})
