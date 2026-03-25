import React, { useState } from 'react'
import { View, Text, Pressable, TextInput } from 'react-native'

interface RestTimerPickerProps {
  value: number
  onSelect: (seconds: number) => void
}

const PRESETS = [30, 60, 90, 120, 180]

export function RestTimerPicker({ value, onSelect }: RestTimerPickerProps) {
  const [customText, setCustomText] = useState('')

  function handleSubmitCustom() {
    const num = parseInt(customText, 10)
    if (isNaN(num) || num < 10 || num > 600) return
    onSelect(num)
    setCustomText('')
  }

  return (
    <View>
      <Text className="text-base font-semibold mb-2">Rest Timer Default</Text>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {PRESETS.map((preset) => {
          const isSelected = value === preset
          return (
            <Pressable
              key={preset}
              testID={
                isSelected
                  ? `rest-preset-${preset}-selected`
                  : `rest-preset-${preset}`
              }
              onPress={() => onSelect(preset)}
              className={`px-4 py-2 rounded-lg border ${
                isSelected
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {preset}s
              </Text>
            </Pressable>
          )
        })}
      </View>
      <TextInput
        placeholder="Custom (10-600s)"
        keyboardType="number-pad"
        value={customText}
        onChangeText={setCustomText}
        onSubmitEditing={handleSubmitCustom}
        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-base"
      />
    </View>
  )
}
