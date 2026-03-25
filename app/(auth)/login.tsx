import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function LoginScreen() {
  const { signIn, loading, error } = useAuth()

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold mb-2">Workouts</Text>
      <Text className="text-base text-gray-500 mb-12">Track your fitness journey</Text>

      {error && (
        <Text className="text-red-500 text-sm mb-4 text-center" testID="login-error">
          {error.message}
        </Text>
      )}

      <TouchableOpacity
        onPress={signIn}
        disabled={loading}
        className="bg-blue-600 rounded-xl px-8 py-4 w-full items-center"
        testID="sign-in-button"
      >
        <Text className="text-white text-base font-semibold">
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
