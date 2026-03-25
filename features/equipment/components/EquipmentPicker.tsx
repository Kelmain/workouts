import React from 'react'
import { View, Text, Pressable } from 'react-native'

export const EQUIPMENT_OPTIONS = [
  'Body only',
  'Kettlebells',
  'Pull-up bar',
  'Exercise ball',
  'Bands',
  'Other',
] as const

interface EquipmentPickerProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

/**
 * Checkbox list for selecting equipment types.
 * "Body only" is always pre-checked and cannot be deselected.
 */
export function EquipmentPicker({ selected, onChange }: EquipmentPickerProps) {
  function handlePress(option: string) {
    if (option === 'Body only') {
      // Cannot be toggled
      return
    }

    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <View className="gap-2">
      {EQUIPMENT_OPTIONS.map((option) => {
        const isChecked = selected.includes(option)
        const isDisabled = option === 'Body only'

        return (
          <Pressable
            key={option}
            testID={`equipment-option-${option}`}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked, disabled: isDisabled }}
            onPress={() => handlePress(option)}
            className={`flex-row items-center gap-3 rounded-lg border p-3 ${
              isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
            } ${isDisabled ? 'opacity-70' : ''}`}
          >
            <View
              className={`h-5 w-5 items-center justify-center rounded border ${
                isChecked ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
              }`}
            >
              {isChecked && <Text className="text-xs font-bold text-white">✓</Text>}
            </View>
            <Text className={`text-base ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
              {option}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
