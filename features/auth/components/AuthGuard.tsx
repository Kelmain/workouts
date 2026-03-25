import React from 'react'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useEquipment } from '@/features/equipment/hooks/useEquipment'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Wraps protected content. Redirects to the login screen when the user
 * is not authenticated. Renders nothing while auth state is loading to
 * prevent a flash of protected content.
 * After auth, checks if equipment is empty → redirects to onboarding.
 */
export function AuthGuard({ children }: AuthGuardProps): React.ReactElement | null {
  const { user, loading } = useAuth()
  const { equipment, loading: equipmentLoading } = useEquipment()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/(auth)/login')
      return
    }
    if (equipmentLoading) return
    if (equipment.length === 0) {
      router.replace('/(auth)/onboarding')
    }
  }, [user, loading, equipment, equipmentLoading, router])

  if (loading || !user) {
    return null
  }

  return <>{children}</>
}
