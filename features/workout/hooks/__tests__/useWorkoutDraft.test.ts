/**
 * TDD tests for useWorkoutDraft hook.
 * Tests drive:
 *   - saveDraft: stores WorkoutDraft in AsyncStorage
 *   - loadDraft: returns saved draft or null
 *   - deleteDraft: removes draft from AsyncStorage
 *   - hasDraft: returns true/false based on draft existence
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

import AsyncStorage from '@react-native-async-storage/async-storage'
import { saveDraft, loadDraft, deleteDraft, hasDraft } from '../useWorkoutDraft'
import type { WorkoutDraft } from '../useWorkoutDraft'

const DRAFT_KEY = '@workout_draft'

const sampleDraft: WorkoutDraft = {
  planType: 'upper',
  startTime: 1700000000000,
  elapsedSeconds: 300,
  exercises: [
    {
      exerciseId: 'ex1',
      exerciseName: 'Push-up',
      sets: [{ reps: 10, weightKg: null, completed: true }],
      order: 0,
    },
  ],
  currentExerciseIndex: 0,
  savedAt: 1700000300000,
}

beforeEach(async () => {
  await AsyncStorage.clear()
  jest.clearAllMocks()
})

describe('saveDraft', () => {
  it('stores draft in AsyncStorage under the correct key', async () => {
    await saveDraft(sampleDraft)

    const stored = await AsyncStorage.getItem(DRAFT_KEY)
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored!)).toEqual(sampleDraft)
  })

  it('overwrites a previous draft', async () => {
    await saveDraft(sampleDraft)

    const updatedDraft: WorkoutDraft = { ...sampleDraft, elapsedSeconds: 600 }
    await saveDraft(updatedDraft)

    const stored = await AsyncStorage.getItem(DRAFT_KEY)
    expect(JSON.parse(stored!).elapsedSeconds).toBe(600)
  })
})

describe('loadDraft', () => {
  it('returns the saved draft', async () => {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(sampleDraft))

    const result = await loadDraft()

    expect(result).toEqual(sampleDraft)
  })

  it('returns null when no draft exists', async () => {
    const result = await loadDraft()

    expect(result).toBeNull()
  })
})

describe('deleteDraft', () => {
  it('removes the draft from AsyncStorage', async () => {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(sampleDraft))

    await deleteDraft()

    const stored = await AsyncStorage.getItem(DRAFT_KEY)
    expect(stored).toBeNull()
  })

  it('does not throw when no draft exists', async () => {
    await expect(deleteDraft()).resolves.not.toThrow()
  })
})

describe('hasDraft', () => {
  it('returns true when a draft exists', async () => {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(sampleDraft))

    const result = await hasDraft()

    expect(result).toBe(true)
  })

  it('returns false when no draft exists', async () => {
    const result = await hasDraft()

    expect(result).toBe(false)
  })
})
