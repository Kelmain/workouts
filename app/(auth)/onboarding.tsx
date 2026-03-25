import React, { useState } from 'react'
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { EquipmentPicker } from '@/features/equipment/components/EquipmentPicker'
import { useEquipment } from '@/features/equipment/hooks/useEquipment'

export default function OnboardingScreen() {
  const router = useRouter()
  const { updateEquipment } = useEquipment()
  const [selected, setSelected] = useState<string[]>(['Body only'])
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    setSaving(true)
    try {
      await updateEquipment(selected)
      router.replace('/(tabs)/home')
    } finally {
      setSaving(false)
    }
  }

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <Text className="mb-2 text-3xl font-bold text-gray-900">What equipment do you have?</Text>
      <Text className="mb-8 text-base text-gray-500">
        We'll personalise your exercise library based on what you have available.
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <EquipmentPicker selected={selected} onChange={setSelected} />
      </ScrollView>

      <View className="pb-8 pt-4">
        <Pressable
          onPress={handleContinue}
          disabled={saving}
          className="items-center rounded-xl bg-blue-600 py-4 active:opacity-80 disabled:opacity-50"
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-semibold text-white">Continue</Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}
