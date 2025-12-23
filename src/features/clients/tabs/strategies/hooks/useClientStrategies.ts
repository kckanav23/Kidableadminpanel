import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { strategyKeys } from '@/features/clients/tabs/strategies/hooks/strategyKeys';
import type { StrategiesByTypeResponse } from '@/types/api';

export type ClientStrategyScope = 'all' | 'assigned';

export function useClientStrategies(clientId: string, scope: ClientStrategyScope) {
  return useQuery<StrategiesByTypeResponse>({
    queryKey: strategyKeys.grouped(clientId, scope),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminStrategyLibrary.getAll1({ clientId, scope });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


