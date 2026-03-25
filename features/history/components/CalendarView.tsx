import React from 'react'
import { Pressable, Text, View } from 'react-native'
import type { WorkoutLog } from '../types'

interface CalendarViewProps {
  logs: WorkoutLog[]
  currentMonth: Date
  onSelectDate: (day: number) => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView({ logs, currentMonth, onSelectDate }: CalendarViewProps) {
  const year = currentMonth.getUTCFullYear()
  const month = currentMonth.getUTCMonth()
  const monthName = MONTH_NAMES[month]

  // Days in this month that have workouts
  const workoutDays = new Set<number>()
  for (const log of logs) {
    if (
      log.date.getUTCFullYear() === year &&
      log.date.getUTCMonth() === month
    ) {
      workoutDays.add(log.date.getUTCDate())
    }
  }

  // Build calendar grid
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay()
  // Convert Sun=0 to Mon-based: Mon=0, Tue=1, ..., Sun=6
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const rows: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }

  return (
    <View className="px-4">
      <Text className="text-lg font-bold text-center mb-3">
        {monthName} {year}
      </Text>

      <View className="flex-row justify-between mb-2">
        {DAY_LABELS.map((label) => (
          <Text key={label} className="text-xs text-gray-500 w-10 text-center">
            {label}
          </Text>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between mb-1">
          {row.map((day, colIndex) => {
            if (day === null) {
              return <View key={colIndex} className="w-10 h-10" />
            }

            const hasWorkout = workoutDays.has(day)

            return (
              <Pressable
                key={colIndex}
                testID={
                  hasWorkout
                    ? `calendar-day-${day}-active`
                    : `calendar-day-${day}`
                }
                onPress={hasWorkout ? () => onSelectDate(day) : undefined}
                className={`w-10 h-10 items-center justify-center rounded-full ${
                  hasWorkout ? 'bg-blue-500' : ''
                }`}
              >
                <Text
                  className={`text-sm ${
                    hasWorkout ? 'text-white font-bold' : 'text-gray-700'
                  }`}
                >
                  {day}
                </Text>
              </Pressable>
            )
          })}
        </View>
      ))}
    </View>
  )
}
