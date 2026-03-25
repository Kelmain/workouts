import type { Exercise, ExerciseFilter } from '../types'
import exercisesData from '@/assets/data/exercises.json'

const exercises: Exercise[] = exercisesData as Exercise[]

/**
 * Returns all exercises from the bundled JSON database.
 */
export function getAllExercises(): Exercise[] {
  return exercises
}

/**
 * Returns exercises filtered by the provided criteria.
 * All filters are applied with AND logic.
 * Null fields on exercises are excluded from filtering (the exercise passes the filter).
 *
 * @param filters - Equipment (OR within), search (name substring), muscleGroup, level, force.
 */
export function getFilteredExercises(filters: ExerciseFilter): Exercise[] {
  return exercises.filter((exercise) => {
    // Equipment filter: OR logic within equipment list
    // "body only" in the list also matches exercises with null equipment
    if (filters.equipment && filters.equipment.length > 0) {
      const lowerEquipment = filters.equipment.map((e) => e.toLowerCase())
      const hasBodyOnly = lowerEquipment.includes('body only')
      const exerciseEquipment = exercise.equipment?.toLowerCase() ?? null

      const equipmentMatch =
        (exerciseEquipment === null && hasBodyOnly) ||
        (exerciseEquipment !== null && lowerEquipment.includes(exerciseEquipment))

      if (!equipmentMatch) return false
    }

    // Search filter: case-insensitive name substring
    if (filters.search && filters.search.length > 0) {
      if (!exercise.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
    }

    // Muscle group filter: matches primaryMuscles
    if (filters.muscleGroup) {
      if (!exercise.primaryMuscles.includes(filters.muscleGroup)) {
        return false
      }
    }

    // Level filter: skip exercises with null level
    if (filters.level) {
      if (exercise.level === null) return false
      if (exercise.level !== filters.level) return false
    }

    // Force filter: skip exercises with null force
    if (filters.force) {
      if (exercise.force === null) return false
      if (exercise.force !== filters.force) return false
    }

    return true
  })
}
