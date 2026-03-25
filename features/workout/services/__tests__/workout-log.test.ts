/**
 * TDD tests for workout-log service.
 * Tests drive:
 *   - saveWorkoutLog: creates workoutLog document in Firestore
 *   - saveWorkoutLog: updates lastWorkoutDate on user document
 *   - saveWorkoutLog: returns the new document ID
 *   - saveWorkoutLog: propagates Firestore write failures
 */

const mockBatchSet = jest.fn()
const mockBatchUpdate = jest.fn()
const mockBatchCommit = jest.fn()
const mockDocId = 'generated-doc-id-123'
const mockWorkoutLogDoc = { id: mockDocId, set: mockBatchSet }
const mockUserDoc = { update: mockBatchUpdate }
const mockBatch = {
  set: mockBatchSet,
  update: mockBatchUpdate,
  commit: mockBatchCommit,
}

const mockWorkoutLogDocRef = { id: mockDocId }
const mockUserDocRef = {}

const mockCollection = jest.fn()
const mockDoc = jest.fn()
const mockFirestoreInstance = {
  collection: mockCollection,
  batch: jest.fn(() => mockBatch),
}

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => mockFirestoreInstance),
  serverTimestamp: jest.fn(() => ({ _methodName: 'serverTimestamp' })),
}))

import firestore from '@react-native-firebase/firestore'
import { saveWorkoutLog } from '../workout-log'
import type { WorkoutLogData } from '../workout-log'

const sampleLog: WorkoutLogData = {
  date: new Date('2024-01-15T10:00:00Z'),
  planType: 'upper',
  durationSeconds: 1800,
  exercises: [
    {
      exerciseId: 'ex1',
      exerciseName: 'Push-up',
      sets: [{ reps: 10, weightKg: null, completed: true }],
      order: 0,
    },
  ],
  notes: null,
}

beforeEach(() => {
  jest.clearAllMocks()

  // Setup collection/doc chain
  const workoutLogsCollectionRef = {
    doc: jest.fn(() => mockWorkoutLogDocRef),
  }
  const usersCollectionRef = {
    doc: jest.fn(() => mockUserDocRef),
  }

  mockCollection.mockImplementation((name: string) => {
    if (name === 'users') return usersCollectionRef
    return workoutLogsCollectionRef
  })

  mockDoc.mockReturnValue(mockWorkoutLogDocRef)

  // batch operations just record calls
  mockBatch.set.mockReturnValue(undefined)
  mockBatch.update.mockReturnValue(undefined)
  mockBatch.commit.mockResolvedValue(undefined)
})

describe('saveWorkoutLog', () => {
  it('creates a workout log document in Firestore', async () => {
    await saveWorkoutLog('uid-1', sampleLog)

    expect(mockBatch.set).toHaveBeenCalledWith(
      mockWorkoutLogDocRef,
      expect.objectContaining({
        planType: 'upper',
        durationSeconds: 1800,
      })
    )
  })

  it('updates lastWorkoutDate on the user document', async () => {
    await saveWorkoutLog('uid-1', sampleLog)

    expect(mockBatch.update).toHaveBeenCalledWith(
      mockUserDocRef,
      expect.objectContaining({
        lastWorkoutDate: expect.anything(),
      })
    )
  })

  it('commits the batch write', async () => {
    await saveWorkoutLog('uid-1', sampleLog)

    expect(mockBatch.commit).toHaveBeenCalledTimes(1)
  })

  it('returns the document ID', async () => {
    const id = await saveWorkoutLog('uid-1', sampleLog)

    expect(id).toBe(mockDocId)
  })

  it('uses the correct uid to address the user document', async () => {
    const usersCollectionRef = {
      doc: jest.fn(() => mockUserDocRef),
    }
    mockCollection.mockImplementation((name: string) => {
      if (name === 'users') return usersCollectionRef
      return { doc: jest.fn(() => mockWorkoutLogDocRef) }
    })

    await saveWorkoutLog('uid-abc', sampleLog)

    expect(usersCollectionRef.doc).toHaveBeenCalledWith('uid-abc')
  })

  it('propagates Firestore write failure', async () => {
    mockBatch.commit.mockRejectedValue(new Error('Firestore write failed'))

    await expect(saveWorkoutLog('uid-1', sampleLog)).rejects.toThrow('Firestore write failed')
  })
})
