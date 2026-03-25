import React, { useState } from 'react'
import { View, TextInput, FlatList, ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard'
import { ExerciseFilters } from '@/features/exercises/components/ExerciseFilters'
import { useExercises } from '@/features/exercises/hooks/useExercises'
import { useExerciseSearch } from '@/features/exercises/hooks/useExerciseSearch'
import { useExerciseFilters } from '@/features/exercises/hooks/useExerciseFilters'
import type { Exercise } from '@/features/exercises/types'

export default function LibraryScreen() {
  const [searchText, setSearchText] = useState('')
  const { exercises: equipmentFilteredExercises, loading } = useExercises()
  const { results: searchResults } = useExerciseSearch(searchText)
  const { filters, setFilter, clearFilters } = useExerciseFilters()

  // Compose: intersect equipment-filtered + search-filtered + manual filters
  // For simplicity, we apply search and manual filters directly on equipment-filtered list
  const filteredExercises = React.useMemo(() => {
    let result = equipmentFilteredExercises

    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase()
      result = result.filter((e) => e.name.toLowerCase().includes(lowerSearch))
    }

    if (filters.level) {
      result = result.filter((e) => e.level === filters.level)
    }

    if (filters.force) {
      result = result.filter((e) => e.force !== null && e.force === filters.force)
    }

    if (filters.muscleGroup) {
      result = result.filter((e) => e.primaryMuscles.includes(filters.muscleGroup!))
    }

    return result
  }, [equipmentFilteredExercises, searchText, filters])

  function renderItem({ item }: { item: Exercise }) {
    return <ExerciseCard exercise={item} />
  }

  function keyExtractor(item: Exercise) {
    return item.id
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <Text className="mb-3 text-2xl font-bold text-gray-900">Exercise Library</Text>

        {/* Search bar */}
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search exercises..."
          placeholderTextColor="#9ca3af"
          className="mb-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
        />

        {/* Filters */}
        <ExerciseFilters filters={filters} onSetFilter={setFilter} onClearFilters={clearFilters} />
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-16 items-center">
            <Text className="text-base text-gray-400">No exercises found</Text>
          </View>
        }
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  )
}
