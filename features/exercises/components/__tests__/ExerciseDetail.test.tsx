/**
 * TDD tests for ExerciseDetail component.
 * Tests drive the implementation of:
 *   - Renders all non-null fields
 *   - Hides null fields
 *   - Renders step-by-step instructions
 *   - Shows placeholder for missing images
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

jest.mock('expo-image', () => ({
  Image: ({ testID, source }: { testID?: string; source?: { uri: string } }) => {
    const React = require('react')
    const { View } = require('react-native')
    return React.createElement(View, { testID: testID ?? 'expo-image', 'data-uri': source?.uri })
  },
}))

import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ExerciseDetail } from '../ExerciseDetail'
import type { Exercise } from '../../types'

const fullExercise: Exercise = {
  id: 'ex-1',
  name: 'Barbell Bench Press',
  force: 'push',
  level: 'intermediate',
  mechanic: 'compound',
  equipment: 'barbell',
  primaryMuscles: ['chest'],
  secondaryMuscles: ['shoulders', 'triceps'],
  instructions: [
    'Lie on the bench with your feet flat on the floor.',
    'Grip the bar just outside shoulder width.',
  ],
  category: 'strength',
  images: ['barbell-bench-press/0.jpg', 'barbell-bench-press/1.jpg'],
}

const minimalExercise: Exercise = {
  id: 'ex-2',
  name: 'Mystery Move',
  force: null,
  level: null,
  mechanic: null,
  equipment: null,
  primaryMuscles: ['chest'],
  secondaryMuscles: [],
  instructions: ['Do the thing'],
  category: 'strength',
  images: [],
}

describe('ExerciseDetail', () => {
  it('renders the exercise name', () => {
    render(<ExerciseDetail exercise={fullExercise} />)

    expect(screen.getByText('Barbell Bench Press')).toBeTruthy()
  })

  it('renders step-by-step instructions', () => {
    render(<ExerciseDetail exercise={fullExercise} />)

    expect(screen.getByText('Lie on the bench with your feet flat on the floor.')).toBeTruthy()
    expect(screen.getByText('Grip the bar just outside shoulder width.')).toBeTruthy()
  })

  it('renders primary muscles', () => {
    render(<ExerciseDetail exercise={fullExercise} />)

    expect(screen.getByText('chest')).toBeTruthy()
  })

  it('renders secondary muscles when present', () => {
    render(<ExerciseDetail exercise={fullExercise} />)

    expect(screen.getByText('shoulders')).toBeTruthy()
    expect(screen.getByText('triceps')).toBeTruthy()
  })

  it('renders equipment when present', () => {
    render(<ExerciseDetail exercise={fullExercise} />)

    expect(screen.getByText('barbell')).toBeTruthy()
  })

  it('renders level and force when present', () => {
    render(<ExerciseDetail exercise={fullExercise} />)

    expect(screen.getByText('intermediate')).toBeTruthy()
    expect(screen.getByText('push')).toBeTruthy()
  })

  it('hides level when null', () => {
    render(<ExerciseDetail exercise={minimalExercise} />)

    expect(screen.queryByTestId('detail-level')).toBeNull()
  })

  it('hides force when null', () => {
    render(<ExerciseDetail exercise={minimalExercise} />)

    expect(screen.queryByTestId('detail-force')).toBeNull()
  })

  it('hides equipment when null', () => {
    render(<ExerciseDetail exercise={minimalExercise} />)

    expect(screen.queryByTestId('detail-equipment')).toBeNull()
  })

  it('hides secondary muscles section when empty', () => {
    render(<ExerciseDetail exercise={minimalExercise} />)

    expect(screen.queryByTestId('secondary-muscles')).toBeNull()
  })

  it('renders exercise images from GitHub raw URLs', () => {
    render(<ExerciseDetail exercise={fullExercise} />)

    const images = screen.getAllByTestId('exercise-image')
    expect(images).toHaveLength(2)
  })

  it('shows placeholder when exercise has no images', () => {
    render(<ExerciseDetail exercise={minimalExercise} />)

    expect(screen.getByTestId('image-placeholder')).toBeTruthy()
  })
})
