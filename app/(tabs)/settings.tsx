import React from 'react'
import { ScrollView, View, Text, Pressable, Alert } from 'react-native'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useEquipment } from '@/features/equipment/hooks/useEquipment'
import { EquipmentPicker } from '@/features/equipment/components/EquipmentPicker'
import { RestTimerPicker } from '@/features/settings/components/RestTimerPicker'
import { useSettingsStore } from '@/features/settings/stores/settings-store'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()
  const { equipment, updateEquipment } = useEquipment()
  const restTimerDefault = useSettingsStore((s) => s.restTimerDefault)
  const setRestTimerDefault = useSettingsStore((s) => s.setRestTimerDefault)

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ])
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-4">
      <Text className="text-xl font-bold px-4 mb-4">Settings</Text>

      {/* Equipment */}
      <View className="px-4 mb-6">
        <EquipmentPicker
          selected={equipment}
          onChange={updateEquipment}
        />
      </View>

      {/* Rest Timer */}
      <View className="px-4 mb-6">
        <RestTimerPicker
          value={restTimerDefault}
          onSelect={setRestTimerDefault}
        />
      </View>

      {/* Account */}
      <View className="px-4 mb-8">
        <Text className="text-base font-semibold mb-2">Account</Text>
        {user && (
          <Text className="text-sm text-gray-500 mb-3">
            {user.email}
          </Text>
        )}
        <Pressable
          onPress={handleSignOut}
          className="bg-red-50 border border-red-200 rounded-lg py-3 items-center"
        >
          <Text className="text-red-600 font-semibold">Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
