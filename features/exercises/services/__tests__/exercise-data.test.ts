/**
 * TDD tests for exercise-data service.
 * Tests drive the implementation of:
 *   - getAllExercises(): loads all exercises from JSON
 *   - getFilteredExercises(filters): filters by equipment, search, muscleGroup, level, force
 *   - AND logic for multiple filters
 *   - Null fields excluded from filtering
 */

// Mock the exercises.json asset using the resolved path (jest moduleNameMapper maps @/ to rootDir/)
jest.mock('../../../../assets/data/exercises.json', () => [
  {
    id: 'exercise-1',
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
  },
  {
    id: 'exercise-2',
    name: 'Barbell Bench Press',
    force: 'push',
    level: 'intermediate',
    mechanic: 'compound',
    equipment: 'barbell',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    instructions: ['Lie on the bench', 'Grip the barbell'],
    category: 'strength',
    images: ['barbell-bench-press/0.jpg'],
  },
  {
    id: 'exercise-3',
    name: 'Kettlebell Swing',
    force: 'pull',
    level: 'intermediate',
    mechanic: 'compound',
    equipment: 'kettlebells',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['glutes', 'lower back'],
    instructions: ['Hold kettlebell', 'Swing'],
    category: 'strength',
    images: ['kettlebell-swing/0.jpg'],
  },
  {
    id: 'exercise-4',
    name: 'Pull-ups',
    force: 'pull',
    level: 'expert',
    mechanic: 'compound',
    equipment: 'body only',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps'],
    instructions: ['Hang from bar', 'Pull yourself up'],
    category: 'strength',
    images: ['pull-ups/0.jpg'],
  },
  {
    id: 'exercise-5',
    name: 'Seated Cable Row',
    force: null,
    level: null,
    mechanic: null,
    equipment: 'cable',
    primaryMuscles: ['middle back'],
    secondaryMuscles: [],
    instructions: ['Sit at cable machine'],
    category: 'strength',
    images: [],
  },
], { virtual: true })

import { getAllExercises, getFilteredExercises } from '../exercise-data'

describe('getAllExercises', () => {
  it('returns all exercises from the JSON file', () => {
    const exercises = getAllExercises()

    expect(exercises).toHaveLength(5)
  })

  it('returns exercises with correct shape', () => {
    const exercises = getAllExercises()
    const first = exercises[0]

    expect(first.id).toBe('exercise-1')
    expect(first.name).toBe('Push-ups')
    expect(first.primaryMuscles).toEqual(['chest'])
  })
})

describe('getFilteredExercises - equipment filter', () => {
  it('returns exercises matching any of the equipment options', () => {
    const result = getFilteredExercises({ equipment: ['kettlebells'] })

    expect(result.map((e) => e.id)).toContain('exercise-3')
    expect(result.map((e) => e.id)).not.toContain('exercise-2')
  })

  it('includes exercises with null equipment when "body only" is in the list', () => {
    const result = getFilteredExercises({ equipment: ['body only'] })

    // exercise-1 has null equipment (body weight), exercise-4 has 'body only'
    expect(result.map((e) => e.id)).toContain('exercise-1')
    expect(result.map((e) => e.id)).toContain('exercise-4')
  })

  it('includes all exercises when no equipment filter provided', () => {
    const result = getFilteredExercises({})

    expect(result).toHaveLength(5)
  })

  it('matches multiple equipment options (OR within equipment filter)', () => {
    const result = getFilteredExercises({ equipment: ['kettlebells', 'barbell'] })

    expect(result.map((e) => e.id)).toContain('exercise-2')
    expect(result.map((e) => e.id)).toContain('exercise-3')
  })
})

describe('getFilteredExercises - search filter', () => {
  it('filters exercises by name (case-insensitive)', () => {
    const result = getFilteredExercises({ search: 'push' })

    expect(result.map((e) => e.id)).toContain('exercise-1') // "Push-ups" matches
    expect(result.map((e) => e.id)).not.toContain('exercise-3') // "Kettlebell Swing" does not match
    expect(result.map((e) => e.id)).not.toContain('exercise-2') // "Barbell Bench Press" does not match
  })

  it('returns all exercises when search is empty string', () => {
    const result = getFilteredExercises({ search: '' })

    expect(result).toHaveLength(5)
  })

  it('is case-insensitive for search', () => {
    const resultLower = getFilteredExercises({ search: 'kettlebell' })
    const resultUpper = getFilteredExercises({ search: 'KETTLEBELL' })

    expect(resultLower.map((e) => e.id)).toEqual(resultUpper.map((e) => e.id))
  })
})

describe('getFilteredExercises - muscleGroup filter', () => {
  it('filters by primary muscle group', () => {
    const result = getFilteredExercises({ muscleGroup: 'chest' })

    expect(result.map((e) => e.id)).toContain('exercise-1')
    expect(result.map((e) => e.id)).toContain('exercise-2')
    expect(result.map((e) => e.id)).not.toContain('exercise-3')
  })
})

describe('getFilteredExercises - level filter', () => {
  it('filters by difficulty level', () => {
    const result = getFilteredExercises({ level: 'beginner' })

    expect(result.map((e) => e.id)).toContain('exercise-1')
    expect(result.map((e) => e.id)).not.toContain('exercise-2')
  })

  it('excludes exercises with null level when level filter is set', () => {
    const result = getFilteredExercises({ level: 'intermediate' })

    expect(result.map((e) => e.id)).not.toContain('exercise-5') // null level
  })
})

describe('getFilteredExercises - force filter', () => {
  it('filters by force type', () => {
    const result = getFilteredExercises({ force: 'pull' })

    expect(result.map((e) => e.id)).toContain('exercise-3')
    expect(result.map((e) => e.id)).toContain('exercise-4')
    expect(result.map((e) => e.id)).not.toContain('exercise-1')
  })

  it('excludes exercises with null force when force filter is set', () => {
    const result = getFilteredExercises({ force: 'push' })

    expect(result.map((e) => e.id)).not.toContain('exercise-5') // null force
  })
})

describe('getFilteredExercises - AND logic composition', () => {
  it('applies multiple filters with AND logic', () => {
    const result = getFilteredExercises({
      level: 'intermediate',
      force: 'push',
    })

    // Only exercise-2 (Barbell Bench Press) is intermediate AND push
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('exercise-2')
  })

  it('returns empty when no exercise matches all filters', () => {
    const result = getFilteredExercises({
      level: 'beginner',
      muscleGroup: 'hamstrings',
    })

    expect(result).toHaveLength(0)
  })
})
