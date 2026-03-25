import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useWorkoutStore } from '../stores/workout-store'
import { SetLogger } from './SetLogger'
import { WorkoutSummary } from './WorkoutSummary'

export function WorkoutPlayer() {
  const [finished, setFinished] = useState(false)
  const [finishDisabled, setFinishDisabled] = useState(false)

  const {
    exercises,
    currentExerciseIndex,
    startTime,
    nextExercise,
    previousExercise,
    finishWorkout,
  } = useWorkoutStore()

  const currentExercise = exercises[currentExerciseIndex]

  function handleFinish() {
    if (finishDisabled) return
    setFinishDisabled(true)
    finishWorkout()
    setFinished(true)
  }

  if (finished) {
    const durationSeconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    return <WorkoutSummary exercises={exercises} durationSeconds={durationSeconds} />
  }

  if (!currentExercise) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No exercises in this workout.</Text>
      </View>
    )
  }

  const setCount = currentExercise.sets.length

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Progress */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-gray-500 text-sm">
          Exercise {currentExerciseIndex + 1} of {exercises.length}
        </Text>
      </View>

      {/* Exercise info */}
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold mb-1">{currentExercise.exerciseName}</Text>
        <Text className="text-gray-500 text-sm">
          Set {setCount + 1} &bull; {setCount} logged
        </Text>
      </View>

      {/* Set Logger */}
      <SetLogger />

      {/* Navigation */}
      <View className="flex-row px-4 gap-3 mt-2">
        <TouchableOpacity
          testID="prev-exercise-button"
          onPress={previousExercise}
          disabled={currentExerciseIndex === 0}
          className={`flex-1 py-3 rounded-lg items-center border ${
            currentExerciseIndex === 0 ? 'border-gray-200' : 'border-gray-400'
          }`}
        >
          <Text className={currentExerciseIndex === 0 ? 'text-gray-300' : 'text-gray-700'}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="next-exercise-button"
          onPress={nextExercise}
          disabled={currentExerciseIndex === exercises.length - 1}
          className={`flex-1 py-3 rounded-lg items-center border ${
            currentExerciseIndex === exercises.length - 1 ? 'border-gray-200' : 'border-blue-600'
          }`}
        >
          <Text
            className={
              currentExerciseIndex === exercises.length - 1 ? 'text-gray-300' : 'text-blue-600'
            }
          >
            Next Exercise
          </Text>
        </TouchableOpacity>
      </View>

      {/* Finish */}
      <TouchableOpacity
        testID="finish-workout-button"
        onPress={handleFinish}
        disabled={finishDisabled}
        className={`mx-4 mt-4 mb-8 py-4 rounded-xl items-center ${
          finishDisabled ? 'bg-gray-300' : 'bg-green-600'
        }`}
      >
        <Text className="text-white font-bold text-lg">Finish Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
