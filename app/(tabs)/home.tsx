import React from 'react'
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWorkoutHistory } from '@/features/history/hooks/useWorkoutHistory'
import { useStats } from '@/features/history/hooks/useStats'
import { useExerciseProgress } from '@/features/history/hooks/useExerciseProgress'
import { getSuggestedPlanType } from '@/features/history/services/suggested-workout'
import { ProgressChart } from '@/features/history/components/ProgressChart'
import type { PlanType } from '@/features/workout/types'

const PLAN_LABELS: Record<PlanType, string> = {
  upper: 'Upper Body',
  lower: 'Lower Body',
  full: 'Full Body',
  custom: 'Custom',
}

export default function HomeScreen() {
  const { user } = useAuth()
  const uid = user?.uid ?? ''
  const { logs, isLoading: logsLoading } = useWorkoutHistory(uid)
  const { stats, isLoading: statsLoading } = useStats(uid)
  const { progress } = useExerciseProgress(uid)
  const router = useRouter()

  const suggestedPlan = getSuggestedPlanType(logs)
  const isLoading = logsLoading || statsLoading

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Suggested Workout */}
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Dashboard</Text>

        <Pressable
          onPress={() => router.push(`/workout/${suggestedPlan}` as never)}
          className="bg-blue-500 rounded-xl p-5 mb-4"
        >
          <Text className="text-white text-sm font-medium">Suggested Workout</Text>
          <Text className="text-white text-xl font-bold mt-1">
            {PLAN_LABELS[suggestedPlan]}
          </Text>
          <Text className="text-blue-100 text-sm mt-1">Tap to start</Text>
        </Pressable>

        {/* Quick Start Options */}
        <View className="flex-row gap-2 mb-6">
          {(['upper', 'lower', 'full', 'custom'] as PlanType[]).map((plan) => (
            <Pressable
              key={plan}
              onPress={() => router.push(`/workout/${plan}` as never)}
              className="flex-1 bg-white border border-gray-200 rounded-lg py-3 items-center"
            >
              <Text className="text-sm font-medium capitalize">{plan}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 mb-4">
        <Text className="text-lg font-bold mb-2">Stats</Text>
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-white rounded-lg p-3 flex-1 min-w-[45%] border border-gray-100">
            <Text className="text-2xl font-bold">{stats.workoutsThisWeek}</Text>
            <Text className="text-sm text-gray-500">This week</Text>
          </View>
          <View className="bg-white rounded-lg p-3 flex-1 min-w-[45%] border border-gray-100">
            <Text className="text-2xl font-bold">{stats.workoutsThisMonth}</Text>
            <Text className="text-sm text-gray-500">This month</Text>
          </View>
          <View className="bg-white rounded-lg p-3 flex-1 min-w-[45%] border border-gray-100">
            <Text className="text-2xl font-bold">{stats.currentStreak}</Text>
            <Text className="text-sm text-gray-500">Week streak</Text>
          </View>
          <View className="bg-white rounded-lg p-3 flex-1 min-w-[45%] border border-gray-100">
            <Text className="text-2xl font-bold">
              {Math.floor(stats.totalTimeMinutes / 60)}h {stats.totalTimeMinutes % 60}m
            </Text>
            <Text className="text-sm text-gray-500">Total time</Text>
          </View>
        </View>
      </View>

      {/* Progress */}
      <View className="mb-8">
        <Text className="text-lg font-bold px-4 mb-2">Progress</Text>
        <ProgressChart progress={progress} />
      </View>
    </ScrollView>
  )
}
