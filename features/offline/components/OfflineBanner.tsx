import React from 'react'
import { View, Text } from 'react-native'

interface OfflineBannerProps {
  isOnline: boolean
}

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) return null

  return (
    <View className="bg-yellow-500 px-4 py-2">
      <Text className="text-white text-center text-sm font-medium">
        You are offline. Changes will sync when reconnected.
      </Text>
    </View>
  )
}
