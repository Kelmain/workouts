import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import type { PlanType } from '../types'

interface PlanOption {
  type: PlanType
  label: string
  description: string
}

const PLAN_OPTIONS: PlanOption[] = [
  { type: 'upper', label: 'Upper Body', description: 'Chest, back, shoulders, arms' },
  { type: 'lower', label: 'Lower Body', description: 'Quads, hamstrings, glutes, calves' },
  { type: 'full', label: 'Full Body', description: 'All muscle groups' },
  { type: 'custom', label: 'Custom', description: 'Build your own workout' },
]

export function PlanSelector() {
  const router = useRouter()

  function handleSelect(planType: PlanType) {
    router.push(`/workout/${planType}` as never)
  }

  return (
    <View className="gap-3 p-4">
      <Text className="text-xl font-bold mb-2">Start a Workout</Text>
      {PLAN_OPTIONS.map((plan) => (
        <TouchableOpacity
          key={plan.type}
          testID={`plan-selector-${plan.type}`}
          onPress={() => handleSelect(plan.type)}
          className="bg-white border border-gray-200 rounded-xl p-4 flex-row justify-between items-center"
        >
          <View>
            <Text className="text-base font-semibold">{plan.label}</Text>
            <Text className="text-gray-500 text-sm">{plan.description}</Text>
          </View>
          <Text className="text-gray-400 text-lg">→</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
