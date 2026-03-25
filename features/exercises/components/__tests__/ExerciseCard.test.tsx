/**
 * TDD tests for ExerciseCard component.
 * Tests drive the implementation of:
 *   - Renders exercise name
 *   - Renders primary muscle badge
 *   - Renders difficulty level badge
 *   - Pressable triggers navigation to detail
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

const mockPush = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
}))

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { ExerciseCard } from '../ExerciseCard'
import type { Exercise } from '../../types'

const mockExercise: Exercise = {
  id: 'ex-1',
  name: 'Push-ups',
  force: 'push',
  level: 'beginner',
  mechanic: 'compound',
  equipment: null,
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps'],
  instructions: ['Start in plank position', 'Lower your chest'],
  category: 'strength',
  images: ['push-ups/0.jpg'],
}

describe('ExerciseCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the exercise name', () => {
    render(<ExerciseCard exercise={mockExercise} />)

    expect(screen.getByText('Push-ups')).toBeTruthy()
  })

  it('renders the primary muscle group badge', () => {
    render(<ExerciseCard exercise={mockExercise} />)

    expect(screen.getByText('chest')).toBeTruthy()
  })

  it('renders the difficulty level badge', () => {
    render(<ExerciseCard exercise={mockExercise} />)

    expect(screen.getByText('beginner')).toBeTruthy()
  })

  it('navigates to exercise detail on press', () => {
    render(<ExerciseCard exercise={mockExercise} />)

    fireEvent.press(screen.getByTestId('exercise-card-ex-1'))

    expect(mockPush).toHaveBeenCalledWith('/exercise/ex-1')
  })

  it('handles exercise with null level gracefully', () => {
    const exerciseWithNullLevel: Exercise = { ...mockExercise, level: null }

    render(<ExerciseCard exercise={exerciseWithNullLevel} />)

    expect(screen.getByText('Push-ups')).toBeTruthy()
    // No level badge rendered
    expect(screen.queryByTestId('level-badge')).toBeNull()
  })
})
