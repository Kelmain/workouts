import '../global.css'

import React from 'react'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthGuard } from '@/features/auth/components/AuthGuard'
import { ErrorBoundary } from '@/features/error/components/ErrorBoundary'
import { OfflineBanner } from '@/features/offline/components/OfflineBanner'
import { useNetworkStatus } from '@/features/offline/hooks/useNetworkStatus'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function AppContent() {
  const { isOnline } = useNetworkStatus()

  return (
    <>
      <OfflineBanner isOnline={isOnline} />
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="exercise" />
        </Stack>
      </AuthGuard>
    </>
  )
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
