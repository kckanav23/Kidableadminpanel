import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { strategyLibraryKeys, type StrategyLibraryListParams } from '@/features/strategyLibrary/hooks/strategyLibraryKeys';
import type { PageResponseStrategyResponse } from '@/types/api';

export function useStrategyLibraryList(params: StrategyLibraryListParams) {
  return useQuery<PageResponseStrategyResponse>({
    queryKey: strategyLibraryKeys.list(params),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminStrategyLibrary.list1({
          q: params.q || undefined,
          type: params.type || undefined,
          global: params.global,
          page: params.page,
          size: params.size ?? 100,
        });
      } catch (error) {
        return await handleApiError(error);
      }
    },
    placeholderData: keepPreviousData,
  });
}


