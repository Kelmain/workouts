import type { WorkoutLog, DashboardStats, ExerciseProgressEntry } from '../types'

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  // getUTCDay: 0=Sun, 1=Mon. Shift so Mon=0
  const diff = day === 0 ? 6 : day - 1
  d.setUTCDate(d.getUTCDate() - diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function calculateStats(
  logs: WorkoutLog[],
  now: Date = new Date()
): DashboardStats {
  if (logs.length === 0) {
    return {
      workoutsThisWeek: 0,
      workoutsThisMonth: 0,
      currentStreak: 0,
      totalTimeMinutes: 0,
    }
  }

  const weekStart = getMonday(now)
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  )

  let workoutsThisWeek = 0
  let workoutsThisMonth = 0
  let totalSeconds = 0

  // Track which week-start timestamps have workouts (for streak)
  const weeksWithWorkouts = new Set<number>()

  for (const log of logs) {
    const logTime = log.date.getTime()

    if (logTime >= weekStart.getTime()) {
      workoutsThisWeek++
    }
    if (logTime >= monthStart.getTime()) {
      workoutsThisMonth++
    }
    totalSeconds += log.durationSeconds
    weeksWithWorkouts.add(getMonday(log.date).getTime())
  }

  // Calculate streak: count consecutive weeks backwards from current week
  let currentStreak = 0
  let checkWeek = getMonday(now)

  while (weeksWithWorkouts.has(checkWeek.getTime())) {
    currentStreak++
    checkWeek = new Date(checkWeek)
    checkWeek.setUTCDate(checkWeek.getUTCDate() - 7)
  }

  return {
    workoutsThisWeek,
    workoutsThisMonth,
    currentStreak,
    totalTimeMinutes: Math.round(totalSeconds / 60),
  }
}

interface ExerciseEntry {
  date: Date
  maxWeightKg: number | null
  maxReps: number
}

export function calculateExerciseProgress(
  logs: WorkoutLog[]
): ExerciseProgressEntry[] {
  if (logs.length === 0) return []

  // Group by exerciseId: collect all appearances with date + best set
  const exerciseMap = new Map<
    string,
    { name: string; entries: ExerciseEntry[] }
  >()

  for (const log of logs) {
    for (const exercise of log.exercises) {
      if (exercise.sets.length === 0) continue

      const maxWeightKg = exercise.sets.reduce<number | null>((max, set) => {
        if (set.weightKg === null) return max
        return max === null ? set.weightKg : Math.max(max, set.weightKg)
      }, null)

      const maxReps = Math.max(...exercise.sets.map((s) => s.reps))

      const entry: ExerciseEntry = {
        date: log.date,
        maxWeightKg,
        maxReps,
      }

      const existing = exerciseMap.get(exercise.exerciseId)
      if (existing) {
        existing.entries.push(entry)
      } else {
        exerciseMap.set(exercise.exerciseId, {
          name: exercise.exerciseName,
          entries: [entry],
        })
      }
    }
  }

  const result: ExerciseProgressEntry[] = []

  for (const [exerciseId, { name, entries }] of exerciseMap) {
    if (entries.length < 2) continue

    // Sort by date ascending
    entries.sort((a, b) => a.date.getTime() - b.date.getTime())

    const firstLog = entries[0]
    const latestLog = entries[entries.length - 1]

    const weightImproved =
      firstLog.maxWeightKg !== null &&
      latestLog.maxWeightKg !== null &&
      latestLog.maxWeightKg > firstLog.maxWeightKg

    const repsImproved = latestLog.maxReps > firstLog.maxReps

    result.push({
      exerciseId,
      exerciseName: name,
      firstLog,
      latestLog,
      improved: weightImproved || repsImproved,
    })
  }

  return result
}
