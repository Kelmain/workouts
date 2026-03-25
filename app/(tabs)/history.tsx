import React, { useState } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWorkoutHistory } from '@/features/history/hooks/useWorkoutHistory'
import { HistoryList } from '@/features/history/components/HistoryList'
import { CalendarView } from '@/features/history/components/CalendarView'

type ViewMode = 'list' | 'calendar'

export default function HistoryScreen() {
  const { user } = useAuth()
  const { logs, isLoading } = useWorkoutHistory(user?.uid ?? '')
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <View className="flex-row justify-between items-center px-4 mb-2">
        <Text className="text-xl font-bold">History</Text>
        <View className="flex-row bg-gray-200 rounded-lg">
          <Pressable
            onPress={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg ${viewMode === 'list' ? 'bg-white' : ''}`}
          >
            <Text className={viewMode === 'list' ? 'font-semibold' : 'text-gray-500'}>
              List
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded-lg ${viewMode === 'calendar' ? 'bg-white' : ''}`}
          >
            <Text className={viewMode === 'calendar' ? 'font-semibold' : 'text-gray-500'}>
              Calendar
            </Text>
          </Pressable>
        </View>
      </View>

      {viewMode === 'list' ? (
        <HistoryList
          logs={logs}
          onPressItem={(logId) => router.push(`/history/${logId}`)}
        />
      ) : (
        <CalendarView
          logs={logs}
          currentMonth={new Date()}
          onSelectDate={(day) => {
            const dayLogs = logs.filter(
              (l) => l.date.getUTCDate() === day
            )
            if (dayLogs.length > 0) {
              router.push(`/history/${dayLogs[0].id}`)
            }
          }}
        />
      )}
    </View>
  )
}
