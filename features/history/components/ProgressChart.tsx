import React from 'react'
import { FlatList, Text, View } from 'react-native'
import type { ExerciseProgressEntry } from '../types'

interface ProgressChartProps {
  progress: ExerciseProgressEntry[]
}

function formatMetric(entry: { maxWeightKg: number | null; maxReps: number }) {
  if (entry.maxWeightKg !== null) {
    return `${entry.maxWeightKg} kg x ${entry.maxReps} reps`
  }
  return `${entry.maxReps} reps`
}

export function ProgressChart({ progress }: ProgressChartProps) {
  if (progress.length === 0) {
    return (
      <View className="items-center justify-center p-8">
        <Text className="text-base text-gray-500">
          No progress data yet. Complete more workouts to track improvement.
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={progress}
      keyExtractor={(item) => item.exerciseId}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View className="bg-white p-3 mx-4 my-1 rounded-lg border border-gray-100">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-semibold">{item.exerciseName}</Text>
            {item.improved && (
              <Text
                testID={`improved-${item.exerciseId}`}
                className="text-green-600 font-bold text-sm"
              >
                Improved
              </Text>
            )}
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-sm text-gray-500">
              First: {formatMetric(item.firstLog)}
            </Text>
            <Text className="text-sm text-gray-700">
              Latest: {formatMetric(item.latestLog)}
            </Text>
          </View>
        </View>
      )}
    />
  )
}
