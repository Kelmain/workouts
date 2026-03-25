/**
 * TDD tests for history-queries service.
 * Tests drive:
 *   - getWorkoutHistory: fetches workout logs from Firestore ordered by date desc
 *   - getWorkoutHistory: respects limit parameter (default 50)
 *   - getWorkoutHistory: filters by date range when provided
 *   - getWorkoutHistory: maps Firestore documents to WorkoutLog[]
 *   - getWorkoutHistory: returns empty array when no logs exist
 */

const mockOrderBy = jest.fn()
const mockLimit = jest.fn()
const mockWhere = jest.fn()
const mockGet = jest.fn()

const mockCollectionRef = {
  orderBy: mockOrderBy,
}

const mockFirestoreInstance = {
  collection: jest.fn(() => mockCollectionRef),
}

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => mockFirestoreInstance),
}))

import { getWorkoutHistory } from '../history-queries'

const mockDocs = [
  {
    id: 'log-1',
    data: () => ({
      date: { toDate: () => new Date('2026-03-25T10:00:00Z') },
      planType: 'upper',
      durationSeconds: 2700,
      exercises: [
        {
          exerciseId: 'ex1',
          exerciseName: 'Push-up',
          sets: [{ reps: 10, weightKg: null, completed: true }],
          order: 0,
        },
      ],
      notes: null,
    }),
  },
  {
    id: 'log-2',
    data: () => ({
      date: { toDate: () => new Date('2026-03-23T09:00:00Z') },
      planType: 'lower',
      durationSeconds: 3000,
      exercises: [
        {
          exerciseId: 'ex2',
          exerciseName: 'Squat',
          sets: [{ reps: 12, weightKg: 16, completed: true }],
          order: 0,
        },
      ],
      notes: 'Felt strong today',
    }),
  },
]

beforeEach(() => {
  jest.clearAllMocks()

  // Default chain: collection -> orderBy -> limit -> get
  const queryWithGet = { get: mockGet }
  mockLimit.mockReturnValue(queryWithGet)
  mockOrderBy.mockReturnValue({ limit: mockLimit, where: mockWhere })
  mockWhere.mockReturnValue({ where: mockWhere, limit: mockLimit })
  mockGet.mockResolvedValue({ docs: mockDocs })
})

describe('getWorkoutHistory', () => {
  it('fetches logs from the correct subcollection path', async () => {
    await getWorkoutHistory('uid-1')

    expect(mockFirestoreInstance.collection).toHaveBeenCalledWith(
      'users/uid-1/workoutLogs'
    )
  })

  it('orders by date descending', async () => {
    await getWorkoutHistory('uid-1')

    expect(mockOrderBy).toHaveBeenCalledWith('date', 'desc')
  })

  it('applies default limit of 50', async () => {
    await getWorkoutHistory('uid-1')

    expect(mockLimit).toHaveBeenCalledWith(50)
  })

  it('applies custom limit when provided', async () => {
    await getWorkoutHistory('uid-1', { limit: 10 })

    expect(mockLimit).toHaveBeenCalledWith(10)
  })

  it('maps Firestore documents to WorkoutLog objects', async () => {
    const logs = await getWorkoutHistory('uid-1')

    expect(logs).toHaveLength(2)
    expect(logs[0]).toEqual({
      id: 'log-1',
      date: new Date('2026-03-25T10:00:00Z'),
      planType: 'upper',
      durationSeconds: 2700,
      exercises: [
        {
          exerciseId: 'ex1',
          exerciseName: 'Push-up',
          sets: [{ reps: 10, weightKg: null, completed: true }],
          order: 0,
        },
      ],
      notes: null,
    })
  })

  it('returns empty array when no logs exist', async () => {
    mockGet.mockResolvedValue({ docs: [] })

    const logs = await getWorkoutHistory('uid-1')

    expect(logs).toEqual([])
  })
})
