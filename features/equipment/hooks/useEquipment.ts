import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getEquipment, updateEquipment as updateEquipmentService } from '../services/equipment-service'

interface UseEquipmentReturn {
  equipment: string[]
  loading: boolean
  updateEquipment: (equipment: string[]) => Promise<void>
}

const EQUIPMENT_QUERY_KEY = 'equipment'

/**
 * Hook to manage user equipment list.
 *
 * Reads equipment from Firestore via TanStack Query (with caching).
 * Provides an updateEquipment function that persists changes and
 * invalidates the cached query.
 */
export function useEquipment(): UseEquipmentReturn {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: [EQUIPMENT_QUERY_KEY, user?.uid],
    queryFn: () => getEquipment(user!.uid),
    enabled: !!user?.uid,
  })

  async function updateEquipment(newEquipment: string[]): Promise<void> {
    if (!user?.uid) return
    await updateEquipmentService(user.uid, newEquipment)
    await queryClient.invalidateQueries({ queryKey: [EQUIPMENT_QUERY_KEY, user.uid] })
  }

  return {
    equipment,
    loading: isLoading,
    updateEquipment,
  }
}
