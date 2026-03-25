import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import type { ExerciseFilter } from '../types'

const MUSCLE_GROUPS = [
  'chest',
  'lats',
  'biceps',
  'triceps',
  'shoulders',
  'hamstrings',
  'quadriceps',
  'glutes',
  'middle back',
  'lower back',
  'abdominals',
  'calves',
  'forearms',
  'traps',
  'neck',
]

const LEVELS = ['beginner', 'intermediate', 'expert']
const FORCES = ['push', 'pull', 'static']

type FilterKey = 'muscleGroup' | 'level' | 'force'

interface ExerciseFiltersProps {
  filters: Pick<ExerciseFilter, FilterKey>
  onSetFilter: (key: FilterKey, value: string | undefined) => void
  onClearFilters: () => void
}

interface FilterChipProps {
  label: string
  active: boolean
  onPress: () => void
}

function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-1.5 ${
        active ? 'border-blue-500 bg-blue-500' : 'border-gray-200 bg-white'
      }`}
    >
      <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </Text>
    </Pressable>
  )
}

/**
 * Filter chips for the exercise library.
 * Supports muscle group, difficulty level, and force type filters.
 */
export function ExerciseFilters({ filters, onSetFilter, onClearFilters }: ExerciseFiltersProps) {
  const hasActiveFilters = Object.keys(filters).length > 0

  function toggle(key: FilterKey, value: string) {
    if (filters[key] === value) {
      onSetFilter(key, undefined)
    } else {
      onSetFilter(key, value)
    }
  }

  return (
    <View className="gap-3 py-2">
      {hasActiveFilters && (
        <Pressable onPress={onClearFilters} className="self-start">
          <Text className="text-sm font-medium text-blue-600">Clear all filters</Text>
        </Pressable>
      )}

      {/* Level filter */}
      <View>
        <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Difficulty
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          <View className="flex-row gap-2">
            {LEVELS.map((level) => (
              <FilterChip
                key={level}
                label={level}
                active={filters.level === level}
                onPress={() => toggle('level', level)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Force filter */}
      <View>
        <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Force
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          <View className="flex-row gap-2">
            {FORCES.map((force) => (
              <FilterChip
                key={force}
                label={force}
                active={filters.force === force}
                onPress={() => toggle('force', force)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Muscle group filter */}
      <View>
        <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Muscle Group
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {MUSCLE_GROUPS.map((muscle) => (
              <FilterChip
                key={muscle}
                label={muscle}
                active={filters.muscleGroup === muscle}
                onPress={() => toggle('muscleGroup', muscle)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
