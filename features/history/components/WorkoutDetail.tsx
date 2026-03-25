import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import type { WorkoutLog } from '../types'

interface WorkoutDetailProps {
  log: WorkoutLog
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatSet(set: { reps: number; weightKg: number | null }): string {
  if (set.weightKg !== null) {
    return `${set.reps} reps @ ${set.weightKg} kg`
  }
  return `${set.reps} reps`
}

export function WorkoutDetail({ log }: WorkoutDetailProps) {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-sm text-gray-500">{formatDate(log.date)}</Text>
      <Text className="text-2xl font-bold capitalize mt-1">
        {log.planType} Body
      </Text>
      <Text className="text-base text-gray-600 mt-1">
        {formatDuration(log.durationSeconds)}
      </Text>

      <View className="mt-6">
        {log.exercises.map((exercise) => (
          <View
            key={exercise.exerciseId}
            className="bg-white p-4 rounded-lg mb-3 border border-gray-100"
          >
            <Text className="text-base font-semibold">
              {exercise.exerciseName}
            </Text>
            {exercise.sets.map((set, i) => (
              <Text key={i} className="text-sm text-gray-600 mt-1">
                Set {i + 1}: {formatSet(set)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
