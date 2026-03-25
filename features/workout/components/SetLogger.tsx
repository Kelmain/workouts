import React, { useState, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { useWorkoutStore } from '../stores/workout-store'

export function SetLogger() {
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(0)

  const { exercises, currentExerciseIndex, logSet } = useWorkoutStore()
  const currentExercise = exercises[currentExerciseIndex]
  const loggedSets = useMemo(() => currentExercise?.sets ?? [], [currentExercise?.sets])

  function handleLogSet() {
    logSet(reps, weight)
  }

  return (
    <View className="p-4">
      {/* Reps stepper */}
      <View className="flex-row items-center mb-4">
        <Text className="w-20 text-base font-medium">Reps</Text>
        <TouchableOpacity
          testID="reps-decrement"
          onPress={() => setReps((r) => Math.max(1, r - 1))}
          className="w-10 h-10 items-center justify-center bg-gray-200 rounded"
        >
          <Text className="text-xl font-bold">-</Text>
        </TouchableOpacity>
        <TextInput
          testID="reps-input"
          value={String(reps)}
          onChangeText={(v) => {
            const n = parseInt(v, 10)
            if (!isNaN(n) && n >= 1) setReps(n)
          }}
          keyboardType="number-pad"
          className="w-16 text-center text-lg border border-gray-300 mx-2 rounded"
        />
        <TouchableOpacity
          testID="reps-increment"
          onPress={() => setReps((r) => r + 1)}
          className="w-10 h-10 items-center justify-center bg-gray-200 rounded"
        >
          <Text className="text-xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Weight stepper */}
      <View className="flex-row items-center mb-6">
        <Text className="w-20 text-base font-medium">Weight (kg)</Text>
        <TouchableOpacity
          testID="weight-decrement"
          onPress={() => setWeight((w) => Math.max(0, w - 2))}
          className="w-10 h-10 items-center justify-center bg-gray-200 rounded"
        >
          <Text className="text-xl font-bold">-</Text>
        </TouchableOpacity>
        <TextInput
          testID="weight-input"
          value={String(weight)}
          onChangeText={(v) => {
            const n = parseInt(v, 10)
            if (!isNaN(n) && n >= 0) setWeight(n)
          }}
          keyboardType="number-pad"
          className="w-16 text-center text-lg border border-gray-300 mx-2 rounded"
        />
        <TouchableOpacity
          testID="weight-increment"
          onPress={() => setWeight((w) => w + 2)}
          className="w-10 h-10 items-center justify-center bg-gray-200 rounded"
        >
          <Text className="text-xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Log Set button */}
      <TouchableOpacity
        testID="log-set-button"
        onPress={handleLogSet}
        className="bg-blue-600 py-3 rounded-lg items-center mb-6"
      >
        <Text className="text-white font-bold text-lg">Log Set</Text>
      </TouchableOpacity>

      {/* Logged sets */}
      <ScrollView>
        {loggedSets.map((set, index) => (
          <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-700">Set {index + 1}</Text>
            <Text className="text-gray-700">
              {set.reps} reps{set.weightKg !== null ? ` @ ${set.weightKg} kg` : ' (bodyweight)'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
