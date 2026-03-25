import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWorkoutHistory } from '@/features/history/hooks/useWorkoutHistory'
import { WorkoutDetail } from '@/features/history/components/WorkoutDetail'

export default function WorkoutDetailScreen() {
  const { logId } = useLocalSearchParams<{ logId: string }>()
  const { user } = useAuth()
  const { logs, isLoading } = useWorkoutHistory(user?.uid ?? '')

  const log = logs.find((l) => l.id === logId)

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!log) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">Workout not found.</Text>
      </View>
    )
  }

  return <WorkoutDetail log={log} />
}
