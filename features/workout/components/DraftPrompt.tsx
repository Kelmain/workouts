import React from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'

interface DraftPromptProps {
  hasDraft: boolean
  onResume: () => void
  onDiscard: () => void
}

export function DraftPrompt({ hasDraft, onResume, onDiscard }: DraftPromptProps) {
  return (
    <Modal visible={hasDraft} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-2xl mx-6 p-6">
          <Text className="text-xl font-bold mb-2">Resume workout?</Text>
          <Text className="text-gray-600 mb-6">
            You have an unfinished workout. Would you like to resume it?
          </Text>
          <TouchableOpacity
            testID="draft-resume-button"
            onPress={onResume}
            className="bg-blue-600 py-3 rounded-xl items-center mb-3"
          >
            <Text className="text-white font-semibold text-base">Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="draft-discard-button"
            onPress={onDiscard}
            className="bg-gray-100 py-3 rounded-xl items-center"
          >
            <Text className="text-gray-700 font-semibold text-base">Discard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
