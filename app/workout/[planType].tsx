import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WorkoutPlayer } from '@/features/workout/components/WorkoutPlayer'
import { useWorkoutStore } from '@/features/workout/stores/workout-store'
import { generatePlan } from '@/features/workout/services/plan-generator'
import type { PlanType, Exercise } from '@/features/workout/types'

// Temporary empty exercises list — will be replaced when Slice 2-3 exercises are available
const PLACEHOLDER_EXERCISES: Exercise[] = []

export default function WorkoutScreen() {
  const { planType } = useLocalSearchParams<{ planType: string }>()
  const [ready, setReady] = useState(false)
  const { startWorkout, resetWorkout, isActive } = useWorkoutStore()

  const validPlanType = (planType === 'upper' ||
    planType === 'lower' ||
    planType === 'full' ||
    planType === 'custom')
    ? (planType as PlanType)
    : null

  useEffect(() => {
    if (!validPlanType) return

    resetWorkout()

    let exercises: Exercise[] = []
    if (validPlanType === 'custom') {
      exercises = []
    } else {
      // User equipment would come from user profile (Slice 2-3); use empty for now
      exercises = generatePlan(validPlanType, [], PLACEHOLDER_EXERCISES)
    }

    startWorkout(validPlanType, exercises)
    setReady(true)
  }, [validPlanType])

  if (!validPlanType) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-red-500">Invalid plan type.</Text>
      </SafeAreaView>
    )
  }

  if (!ready) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-bold capitalize">
          {validPlanType === 'custom' ? 'Custom Workout' : `${validPlanType} Body Workout`}
        </Text>
      </View>
      <WorkoutPlayer />
    </SafeAreaView>
  )
}
