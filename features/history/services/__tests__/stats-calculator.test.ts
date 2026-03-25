/**
 * TDD tests for stats-calculator service.
 * Pure functions — no mocks needed.
 *
 * Tests drive:
 *   - calculateStats: workoutsThisWeek counts logs in current Mon-Sun week
 *   - calculateStats: workoutsThisMonth counts logs in current calendar month
 *   - calculateStats: currentStreak counts consecutive weeks with at least 1 workout
 *   - calculateStats: streak resets to 0 when a full week has no workout
 *   - calculateStats: totalTimeMinutes sums all durations
 *   - calculateStats: returns zeros for empty logs
 *   - calculateExerciseProgress: extracts first vs latest per exercise
 *   - calculateExerciseProgress: improved flag based on weight or reps increase
 */

import {
  calculateStats,
  calculateExerciseProgress,
} from '../stats-calculator'
import type { WorkoutLog } from '../../types'

// Fixed "now" for deterministic tests: Tuesday March 25, 2026
// Week: Mon March 23 – Sun March 29
const NOW = new Date('2026-03-25T10:00:00Z')

function makeLog(
  overrides: Partial<WorkoutLog> & { date: Date }
): WorkoutLog {
  return {
    id: `log-${Date.now()}-${Math.random()}`,
    planType: 'upper',
    durationSeconds: 1800,
    exercises: [],
    notes: null,
    ...overrides,
  }
}

describe('calculateStats', () => {
  it('counts workouts this week (Mon-Sun)', () => {
    const logs = [
      makeLog({ date: new Date('2026-03-24T08:00:00Z') }), // Mon
      makeLog({ date: new Date('2026-03-25T08:00:00Z') }), // Tue
      makeLog({ date: new Date('2026-03-22T08:00:00Z') }), // Sun (prev week)
    ]

    const stats = calculateStats(logs, NOW)

    expect(stats.workoutsThisWeek).toBe(2)
  })

  it('counts workouts this month', () => {
    const logs = [
      makeLog({ date: new Date('2026-03-01T08:00:00Z') }),
      makeLog({ date: new Date('2026-03-15T08:00:00Z') }),
      makeLog({ date: new Date('2026-03-25T08:00:00Z') }),
      makeLog({ date: new Date('2026-02-28T08:00:00Z') }), // Feb
    ]

    const stats = calculateStats(logs, NOW)

    expect(stats.workoutsThisMonth).toBe(3)
  })

  it('calculates streak as consecutive weeks with at least 1 workout', () => {
    // 4 consecutive weeks with workouts (current + 3 prior)
    const logs = [
      makeLog({ date: new Date('2026-03-25T08:00:00Z') }), // current week
      makeLog({ date: new Date('2026-03-17T08:00:00Z') }), // week -1
      makeLog({ date: new Date('2026-03-10T08:00:00Z') }), // week -2
      makeLog({ date: new Date('2026-03-03T08:00:00Z') }), // week -3
    ]

    const stats = calculateStats(logs, NOW)

    expect(stats.currentStreak).toBe(4)
  })

  it('resets streak when a full week has no workout', () => {
    const logs = [
      makeLog({ date: new Date('2026-03-25T08:00:00Z') }), // current week
      // gap: week of March 16-22 has no workout
      makeLog({ date: new Date('2026-03-10T08:00:00Z') }), // week -2
    ]

    const stats = calculateStats(logs, NOW)

    expect(stats.currentStreak).toBe(1)
  })

  it('sums total time in minutes', () => {
    const logs = [
      makeLog({ durationSeconds: 1800, date: new Date('2026-03-25T08:00:00Z') }), // 30min
      makeLog({ durationSeconds: 2700, date: new Date('2026-03-24T08:00:00Z') }), // 45min
    ]

    const stats = calculateStats(logs, NOW)

    expect(stats.totalTimeMinutes).toBe(75)
  })

  it('returns zeros for empty logs', () => {
    const stats = calculateStats([], NOW)

    expect(stats).toEqual({
      workoutsThisWeek: 0,
      workoutsThisMonth: 0,
      currentStreak: 0,
      totalTimeMinutes: 0,
    })
  })
})

describe('calculateExerciseProgress', () => {
  it('extracts first and latest log per exercise', () => {
    const logs: WorkoutLog[] = [
      makeLog({
        date: new Date('2026-03-25T08:00:00Z'),
        exercises: [
          {
            exerciseId: 'kb-press',
            exerciseName: 'Kettlebell Press',
            sets: [
              { reps: 8, weightKg: 20, completed: true },
              { reps: 6, weightKg: 20, completed: true },
            ],
            order: 0,
          },
        ],
      }),
      makeLog({
        date: new Date('2026-03-10T08:00:00Z'),
        exercises: [
          {
            exerciseId: 'kb-press',
            exerciseName: 'Kettlebell Press',
            sets: [
              { reps: 6, weightKg: 16, completed: true },
            ],
            order: 0,
          },
        ],
      }),
    ]

    const progress = calculateExerciseProgress(logs)

    expect(progress).toHaveLength(1)
    expect(progress[0].exerciseId).toBe('kb-press')
    expect(progress[0].firstLog.maxWeightKg).toBe(16)
    expect(progress[0].firstLog.maxReps).toBe(6)
    expect(progress[0].latestLog.maxWeightKg).toBe(20)
    expect(progress[0].latestLog.maxReps).toBe(8)
  })

  it('sets improved=true when latest weight exceeds first', () => {
    const logs: WorkoutLog[] = [
      makeLog({
        date: new Date('2026-03-25T08:00:00Z'),
        exercises: [
          {
            exerciseId: 'kb-press',
            exerciseName: 'Kettlebell Press',
            sets: [{ reps: 8, weightKg: 20, completed: true }],
            order: 0,
          },
        ],
      }),
      makeLog({
        date: new Date('2026-03-10T08:00:00Z'),
        exercises: [
          {
            exerciseId: 'kb-press',
            exerciseName: 'Kettlebell Press',
            sets: [{ reps: 8, weightKg: 16, completed: true }],
            order: 0,
          },
        ],
      }),
    ]

    const progress = calculateExerciseProgress(logs)

    expect(progress[0].improved).toBe(true)
  })

  it('sets improved=false when no improvement', () => {
    const logs: WorkoutLog[] = [
      makeLog({
        date: new Date('2026-03-25T08:00:00Z'),
        exercises: [
          {
            exerciseId: 'pushup',
            exerciseName: 'Push-up',
            sets: [{ reps: 10, weightKg: null, completed: true }],
            order: 0,
          },
        ],
      }),
      makeLog({
        date: new Date('2026-03-10T08:00:00Z'),
        exercises: [
          {
            exerciseId: 'pushup',
            exerciseName: 'Push-up',
            sets: [{ reps: 10, weightKg: null, completed: true }],
            order: 0,
          },
        ],
      }),
    ]

    const progress = calculateExerciseProgress(logs)

    expect(progress[0].improved).toBe(false)
  })

  it('returns empty array for empty logs', () => {
    expect(calculateExerciseProgress([])).toEqual([])
  })
})
