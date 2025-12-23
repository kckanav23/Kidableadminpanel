import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { parentKeys, type ParentsListParams } from '@/features/parents/hooks/parentKeys';
import type { PageResponseParentResponse } from '@/types/api';

export function useParents(params: ParentsListParams) {
  return useQuery<PageResponseParentResponse>({
    queryKey: parentKeys.list(params),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminParents.list6({
          q: params.q || undefined,
          status: params.status || undefined,
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


