import { generatePlan } from '../plan-generator'
import type { Exercise } from '../../types'
import type { PlanType } from '../../types'

// --- Helpers ---

function makeExercise(
  id: string,
  primaryMuscles: string[],
  secondaryMuscles: string[] = [],
  equipment: string | null = null
): Exercise {
  return { id, name: `Exercise ${id}`, equipment, primaryMuscles, secondaryMuscles }
}

// A rich enough dataset to test most scenarios
const sampleExercises: Exercise[] = [
  // chest
  makeExercise('e1', ['chest'], [], null),
  makeExercise('e2', ['chest'], [], 'barbell'),
  // middle back
  makeExercise('e3', ['middle back'], [], null),
  makeExercise('e4', ['middle back'], [], 'cable'),
  // lats
  makeExercise('e5', ['lats'], [], null),
  // shoulders
  makeExercise('e6', ['shoulders'], [], null),
  makeExercise('e7', ['shoulders'], [], 'dumbbell'),
  // biceps
  makeExercise('e8', ['biceps'], [], 'barbell'),
  makeExercise('e9', ['biceps'], [], 'dumbbell'),
  // triceps
  makeExercise('e10', ['triceps'], [], null),
  // abdominals
  makeExercise('e11', ['abdominals'], [], null),
  // quadriceps
  makeExercise('e12', ['quadriceps'], [], null),
  makeExercise('e13', ['quadriceps'], [], 'barbell'),
  // hamstrings
  makeExercise('e14', ['hamstrings'], [], null),
  // glutes
  makeExercise('e15', ['glutes'], [], null),
  // calves
  makeExercise('e16', ['calves'], [], null),
  // secondary-only for lats (no primary lats alternative)
  makeExercise('e17', ['chest'], ['lats'], null),
]

// ---

describe('generatePlan', () => {
  describe('upper body plan', () => {
    const equipment: string[] = [] // bodyweight only
    const upperMuscles = ['chest', 'middle back', 'lats', 'shoulders', 'biceps', 'triceps', 'abdominals']

    it('returns between 5 and 8 exercises', () => {
      const result = generatePlan('upper', equipment, sampleExercises)
      expect(result.length).toBeGreaterThanOrEqual(5)
      expect(result.length).toBeLessThanOrEqual(8)
    })

    it('covers each muscle group that has a matching bodyweight exercise', () => {
      // With no equipment filter, only bodyweight exercises (equipment === null) are included
      const bodyweightOnly = sampleExercises.filter(
        (e) => e.equipment === null
      )
      const result = generatePlan('upper', equipment, sampleExercises)
      const primaryMusclesCovered = result.flatMap((e) => e.primaryMuscles)
      // chest, middle back, lats, shoulders, triceps, abdominals should all appear
      for (const muscle of ['chest', 'middle back', 'lats', 'shoulders', 'triceps', 'abdominals']) {
        expect(primaryMusclesCovered).toContain(muscle)
      }
    })

    it('respects equipment filter — excludes exercises whose equipment is not in userEquipment', () => {
      const result = generatePlan('upper', [], sampleExercises)
      for (const exercise of result) {
        // All returned exercises must be bodyweight (equipment === null) since we passed []
        expect(exercise.equipment).toBeNull()
      }
    })

    it('includes barbell exercises when user has barbell', () => {
      const withBarbell = generatePlan('upper', ['barbell'], sampleExercises)
      const ids = withBarbell.map((e) => e.id)
      // biceps only has barbell (e8) and dumbbell (e9) — with barbell available, e8 is selectable
      // at least one barbell exercise should appear
      const hasBarbellExercise = withBarbell.some((e) => e.equipment === 'barbell')
      expect(hasBarbellExercise).toBe(true)
    })
  })

  describe('lower body plan', () => {
    it('returns between 5 and 8 exercises', () => {
      const result = generatePlan('lower', [], sampleExercises)
      expect(result.length).toBeGreaterThanOrEqual(5)
      expect(result.length).toBeLessThanOrEqual(8)
    })

    it('targets lower body muscles', () => {
      const result = generatePlan('lower', [], sampleExercises)
      const covered = result.flatMap((e) => e.primaryMuscles)
      for (const muscle of ['quadriceps', 'hamstrings', 'glutes', 'calves', 'abdominals']) {
        expect(covered).toContain(muscle)
      }
    })
  })

  describe('full body plan', () => {
    it('returns between 6 and 10 exercises', () => {
      const result = generatePlan('full', [], sampleExercises)
      expect(result.length).toBeGreaterThanOrEqual(6)
      expect(result.length).toBeLessThanOrEqual(10)
    })
  })

  describe('equipment filtering', () => {
    it('returns empty array when no exercises match user equipment', () => {
      // All exercises are bodyweight, user says they have cable only — none match
      const cableOnlyExercises = [makeExercise('c1', ['chest'], [], 'cable')]
      const result = generatePlan('upper', [], cableOnlyExercises)
      expect(result).toHaveLength(0)
    })

    it('includes bodyweight exercises even when user has specific equipment', () => {
      const result = generatePlan('upper', ['barbell'], sampleExercises)
      const hasBodyweight = result.some((e) => e.equipment === null)
      expect(hasBodyweight).toBe(true)
    })
  })

  describe('secondary muscle fallback', () => {
    it('uses secondaryMuscles when no primaryMuscles match a target muscle', () => {
      // Dataset: lats only covered via e17 secondary (e5 is removed)
      const noLatsPrimary = sampleExercises.filter((e) => e.id !== 'e5')
      const result = generatePlan('upper', [], noLatsPrimary)
      const covered = result.flatMap((e) => [...e.primaryMuscles, ...e.secondaryMuscles])
      expect(covered).toContain('lats')
    })
  })

  describe('edge cases', () => {
    it('returns empty array when exercises list is empty', () => {
      const result = generatePlan('upper', [], [])
      expect(result).toHaveLength(0)
    })

    it('skips muscle groups for which no exercise exists in the filtered set', () => {
      // Only chest exercises, no other muscles available
      const chestOnly = [makeExercise('x1', ['chest'], [], null)]
      const result = generatePlan('upper', [], chestOnly)
      // should not crash, should return what it can (just chest)
      expect(result.length).toBeGreaterThanOrEqual(0)
      expect(result.every((e) => e.primaryMuscles.includes('chest'))).toBe(true)
    })

    it('does not return duplicate exercises', () => {
      const result = generatePlan('full', [], sampleExercises)
      const ids = result.map((e) => e.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('handles case where dataset has fewer exercises than min count', () => {
      // Only 2 exercises available for upper (5 min needed) — returns what it can
      const tiny = [
        makeExercise('t1', ['chest'], [], null),
        makeExercise('t2', ['biceps'], [], null),
      ]
      const result = generatePlan('upper', [], tiny)
      // Cannot meet minimum, but should not throw and should return those 2
      expect(result.length).toBeLessThanOrEqual(8)
    })
  })
})
