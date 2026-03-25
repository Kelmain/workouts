/**
 * TDD tests for EquipmentPicker component.
 * Tests drive the implementation of:
 *   - Renders all equipment options
 *   - "Body only" is pre-checked and disabled
 *   - Selecting/deselecting options calls onChange
 */

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ onAuthStateChanged: jest.fn() })),
}))

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({ get: jest.fn(), update: jest.fn() })),
    })),
  })),
}))

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { EquipmentPicker } from '../EquipmentPicker'

describe('EquipmentPicker', () => {
  const defaultProps = {
    selected: ['Body only'],
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all equipment options', () => {
    render(<EquipmentPicker {...defaultProps} />)

    expect(screen.getByText('Body only')).toBeTruthy()
    expect(screen.getByText('Kettlebells')).toBeTruthy()
    expect(screen.getByText('Pull-up bar')).toBeTruthy()
    expect(screen.getByText('Exercise ball')).toBeTruthy()
    expect(screen.getByText('Bands')).toBeTruthy()
    expect(screen.getByText('Other')).toBeTruthy()
  })

  it('"Body only" is pre-checked when selected array contains it', () => {
    render(<EquipmentPicker selected={['Body only']} onChange={jest.fn()} />)

    // "Body only" should appear checked — we test via the testID or accessibilityState
    const bodyOnlyOption = screen.getByTestId('equipment-option-Body only')
    expect(bodyOnlyOption.props.accessibilityState?.checked).toBe(true)
  })

  it('"Body only" is disabled (cannot be toggled off)', () => {
    const onChange = jest.fn()
    render(<EquipmentPicker selected={['Body only']} onChange={onChange} />)

    fireEvent.press(screen.getByTestId('equipment-option-Body only'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('calls onChange with item added when an unchecked option is pressed', () => {
    const onChange = jest.fn()
    render(<EquipmentPicker selected={['Body only']} onChange={onChange} />)

    fireEvent.press(screen.getByTestId('equipment-option-Kettlebells'))

    expect(onChange).toHaveBeenCalledWith(['Body only', 'Kettlebells'])
  })

  it('calls onChange with item removed when a checked non-body-only option is pressed', () => {
    const onChange = jest.fn()
    render(
      <EquipmentPicker selected={['Body only', 'Kettlebells']} onChange={onChange} />
    )

    fireEvent.press(screen.getByTestId('equipment-option-Kettlebells'))

    expect(onChange).toHaveBeenCalledWith(['Body only'])
  })

  it('shows checked state for currently selected items', () => {
    render(
      <EquipmentPicker selected={['Body only', 'Bands']} onChange={jest.fn()} />
    )

    const bandsOption = screen.getByTestId('equipment-option-Bands')
    expect(bandsOption.props.accessibilityState?.checked).toBe(true)

    const kettlebellsOption = screen.getByTestId('equipment-option-Kettlebells')
    expect(kettlebellsOption.props.accessibilityState?.checked).toBe(false)
  })
})
