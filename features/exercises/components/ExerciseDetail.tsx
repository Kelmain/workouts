import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import type { Exercise } from '../types'

const EXERCISE_IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

interface ExerciseDetailProps {
  exercise: Exercise
}

/**
 * Full detail view for an exercise.
 * Shows name, images (from GitHub), instructions, muscles, equipment, level, and force.
 * Null fields are hidden.
 */
export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Images */}
      {exercise.images.length > 0 ? (
        <View className="flex-row flex-wrap">
          {exercise.images.map((imagePath) => (
            <Image
              key={imagePath}
              testID="exercise-image"
              source={{ uri: `${EXERCISE_IMAGE_BASE_URL}${imagePath}` }}
              className="h-48 w-full"
              contentFit="cover"
            />
          ))}
        </View>
      ) : (
        <View
          testID="image-placeholder"
          className="h-48 w-full items-center justify-center bg-gray-100"
        >
          <Text className="text-sm text-gray-400">No image available</Text>
        </View>
      )}

      <View className="p-4 gap-4">
        {/* Name */}
        <Text className="text-2xl font-bold text-gray-900">{exercise.name}</Text>

        {/* Metadata badges */}
        <View className="flex-row flex-wrap gap-2">
          {exercise.level !== null && (
            <View testID="detail-level" className="rounded-full bg-blue-100 px-3 py-1">
              <Text className="text-sm font-medium text-blue-700">{exercise.level}</Text>
            </View>
          )}
          {exercise.force !== null && (
            <View testID="detail-force" className="rounded-full bg-purple-100 px-3 py-1">
              <Text className="text-sm font-medium text-purple-700">{exercise.force}</Text>
            </View>
          )}
          {exercise.equipment !== null && (
            <View testID="detail-equipment" className="rounded-full bg-gray-100 px-3 py-1">
              <Text className="text-sm font-medium text-gray-700">{exercise.equipment}</Text>
            </View>
          )}
        </View>

        {/* Primary Muscles */}
        <View>
          <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Primary Muscles
          </Text>
          <View className="mt-1 flex-row flex-wrap gap-2">
            {exercise.primaryMuscles.map((muscle) => (
              <Text key={muscle} className="text-sm text-gray-700">
                {muscle}
              </Text>
            ))}
          </View>
        </View>

        {/* Secondary Muscles */}
        {exercise.secondaryMuscles.length > 0 && (
          <View testID="secondary-muscles">
            <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Secondary Muscles
            </Text>
            <View className="mt-1 flex-row flex-wrap gap-2">
              {exercise.secondaryMuscles.map((muscle) => (
                <Text key={muscle} className="text-sm text-gray-700">
                  {muscle}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Instructions */}
        <View>
          <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Instructions
          </Text>
          <View className="mt-2 gap-2">
            {exercise.instructions.map((step, index) => (
              <View key={index} className="flex-row gap-3">
                <Text className="text-sm font-semibold text-blue-600">{index + 1}.</Text>
                <Text className="flex-1 text-sm text-gray-700">{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
