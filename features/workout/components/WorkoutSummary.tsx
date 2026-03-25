import React from 'react'
import { View, Text } from 'react-native'
import type { ExerciseLog } from '../types'

interface Props {
  exercises: ExerciseLog[]
  durationSeconds: number
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins} min ${secs} sec`
}

export const WorkoutSummary = React.memo(function WorkoutSummary({ exercises, durationSeconds }: Props) {
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  const exerciseCount = exercises.length

  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-2xl font-bold mb-6">Workout Complete</Text>

      <View className="bg-gray-50 rounded-xl p-6 w-full gap-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-base">Duration</Text>
          <Text testID="summary-duration" className="text-lg font-semibold">{formatDuration(durationSeconds)}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-base">Exercises completed</Text>
          <Text testID="summary-exercises" className="text-lg font-semibold">{exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-base">Total sets logged</Text>
          <Text testID="summary-sets" className="text-lg font-semibold">{totalSets} set{totalSets !== 1 ? 's' : ''}</Text>
        </View>
      </View>
    </View>
  )
})
