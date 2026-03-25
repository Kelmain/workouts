import planTemplates from '../../../assets/data/plan-templates.json'
import type { Exercise, PlanType } from '../types'

const LIMITS: Record<PlanType, { min: number; max: number }> = {
  upper: { min: 5, max: 8 },
  lower: { min: 5, max: 8 },
  full: { min: 6, max: 10 },
  custom: { min: 0, max: 9999 },
}

/**
 * Checks whether an exercise is compatible with the user's equipment.
 * An exercise is allowed if:
 *  - Its equipment is null/empty (bodyweight), OR
 *  - Its equipment is in the user's equipment list.
 */
function isEquipmentAllowed(exercise: Exercise, userEquipment: string[]): boolean {
  const eq = exercise.equipment
  if (eq === null || eq === '' || eq === undefined) return true
  return userEquipment.includes(eq)
}

/**
 * Randomly pick one item from an array. Returns undefined for empty arrays.
 */
function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Fisher-Yates shuffle (in place), returns the array.
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Generates a workout plan.
 *
 * Algorithm:
 *  1. Filter exercises by equipment compatibility.
 *  2. For each target muscle group, find one exercise (primary first, secondary fallback).
 *  3. Deduplicate — an exercise can only appear once.
 *  4. Enforce count limits (min/max per plan type).
 *  5. Shuffle final list.
 */
export function generatePlan(
  planType: PlanType,
  userEquipment: string[],
  exercises: Exercise[]
): Exercise[] {
  if (planType === 'custom') return []

  const targetMuscles: string[] = planTemplates[planType as keyof typeof planTemplates] ?? []
  const { min, max } = LIMITS[planType]

  // Step 1 — filter by equipment
  const available = exercises.filter((e) => isEquipmentAllowed(e, userEquipment))

  if (available.length === 0) return []

  // Step 2 — pick one exercise per muscle group
  const selected: Exercise[] = []
  const usedIds = new Set<string>()

  // Track which exercises were chosen for each muscle so we can reuse for min adjustment
  const muscleToExercise = new Map<string, Exercise>()

  for (const muscle of targetMuscles) {
    // Primary match
    const primaryCandidates = available.filter(
      (e) => !usedIds.has(e.id) && e.primaryMuscles.includes(muscle)
    )
    let pick = pickRandom(primaryCandidates)

    // Secondary fallback
    if (pick === undefined) {
      const secondaryCandidates = available.filter(
        (e) => !usedIds.has(e.id) && e.secondaryMuscles.includes(muscle)
      )
      pick = pickRandom(secondaryCandidates)
    }

    if (pick !== undefined) {
      selected.push(pick)
      usedIds.add(pick.id)
      muscleToExercise.set(muscle, pick)
    }
  }

  // Step 3 — enforce max: remove from overrepresented groups
  if (selected.length > max) {
    // Count how many exercises cover each muscle
    const muscleCount = new Map<string, number>()
    for (const muscle of targetMuscles) {
      const ex = muscleToExercise.get(muscle)
      if (ex) {
        muscleCount.set(muscle, (muscleCount.get(muscle) ?? 0) + 1)
      }
    }

    while (selected.length > max) {
      // Find a removable exercise — one whose muscle group has more than 1 exercise
      let removed = false
      for (let i = selected.length - 1; i >= 0; i--) {
        const ex = selected[i]
        // Check if this exercise's primary muscles each have another exercise covering them
        const canRemove = ex.primaryMuscles.some((m) => (muscleCount.get(m) ?? 0) > 1)
        if (canRemove) {
          selected.splice(i, 1)
          usedIds.delete(ex.id)
          for (const m of ex.primaryMuscles) {
            muscleCount.set(m, Math.max(0, (muscleCount.get(m) ?? 1) - 1))
          }
          removed = true
          break
        }
      }
      if (!removed) break // can't remove further without losing coverage
    }
  }

  // Step 4 — enforce min: add more exercises from available pool if under min
  if (selected.length < min) {
    const remaining = available.filter((e) => !usedIds.has(e.id))
    const shuffledRemaining = shuffle([...remaining])
    for (const ex of shuffledRemaining) {
      if (selected.length >= min) break
      selected.push(ex)
      usedIds.add(ex.id)
    }
  }

  // Step 5 — shuffle
  return shuffle(selected)
}
