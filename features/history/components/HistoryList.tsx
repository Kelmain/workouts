import React from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import type { WorkoutLog } from '../types'

interface HistoryListProps {
  logs: WorkoutLog[]
  onPressItem: (logId: string) => void
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function exerciseCountLabel(count: number): string {
  return count === 1 ? '1 exercise' : `${count} exercises`
}

export function HistoryList({ logs, onPressItem }: HistoryListProps) {
  if (logs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-lg text-gray-500 text-center">
          No workouts yet. Start your first session!
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={logs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPressItem(item.id)}
          className="bg-white p-4 mx-4 my-1 rounded-lg border border-gray-100"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-semibold capitalize">
              {item.planType}
            </Text>
            <Text className="text-sm text-gray-500">
              {formatDate(item.date)}
            </Text>
          </View>
          <View className="flex-row mt-1 gap-4">
            <Text className="text-sm text-gray-600">
              {formatDuration(item.durationSeconds)}
            </Text>
            <Text className="text-sm text-gray-600">
              {exerciseCountLabel(item.exercises.length)}
            </Text>
          </View>
        </Pressable>
      )}
    />
  )
}
