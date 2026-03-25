import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ExerciseDetail } from '@/features/exercises/components/ExerciseDetail'
import { getAllExercises } from '@/features/exercises/services/exercise-data'

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const exercise = getAllExercises().find((e) => e.id === id)

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-gray-500">Exercise not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-2">
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <Text className="text-base font-medium text-blue-600">← Back</Text>
        </Pressable>
      </View>
      <ExerciseDetail exercise={exercise} />
    </SafeAreaView>
  )
}
