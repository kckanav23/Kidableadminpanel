import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { goalKeys } from '@/features/clients/tabs/goals/hooks/goalKeys';
import type { GoalResponse } from '@/types/api';

export function useClientGoals({ clientId, status }: { clientId: string; status?: string }) {
  return useQuery<GoalResponse[]>({
    queryKey: goalKeys.list(clientId, status),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminGoals.getGoals({ clientId, status: status || undefined });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


