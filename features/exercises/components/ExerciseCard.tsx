import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import type { Exercise } from '../types'

interface ExerciseCardProps {
  exercise: Exercise
}

/**
 * Compact card displaying exercise name, primary muscle badge, and difficulty level badge.
 * Pressing the card navigates to the exercise detail screen.
 */
export const ExerciseCard = React.memo(function ExerciseCard({ exercise }: ExerciseCardProps) {
  const router = useRouter()

  function handlePress() {
    router.push(`/exercise/${exercise.id}`)
  }

  return (
    <Pressable
      testID={`exercise-card-${exercise.id}`}
      onPress={handlePress}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm active:opacity-80"
    >
      <Text className="text-base font-semibold text-gray-900">{exercise.name}</Text>
      <View className="mt-2 flex-row flex-wrap gap-2">
        {exercise.primaryMuscles[0] && (
          <View className="rounded-full bg-blue-100 px-2 py-0.5">
            <Text className="text-xs font-medium text-blue-700">
              {exercise.primaryMuscles[0]}
            </Text>
          </View>
        )}
        {exercise.level !== null && (
          <View
            testID="level-badge"
            className={`rounded-full px-2 py-0.5 ${
              exercise.level === 'beginner'
                ? 'bg-green-100'
                : exercise.level === 'intermediate'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                exercise.level === 'beginner'
                  ? 'text-green-700'
                  : exercise.level === 'intermediate'
                    ? 'text-yellow-700'
                    : 'text-red-700'
              }`}
            >
              {exercise.level}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  )
})
