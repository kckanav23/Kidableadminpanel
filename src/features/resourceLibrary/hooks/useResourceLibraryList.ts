import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { resourceLibraryKeys, type ResourceLibraryListParams } from '@/features/resourceLibrary/hooks/resourceLibraryKeys';
import type { PageResponseResourceLibraryResponse } from '@/types/api';

export function useResourceLibraryList(params: ResourceLibraryListParams) {
  return useQuery<PageResponseResourceLibraryResponse>({
    queryKey: resourceLibraryKeys.list(params),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminResourceLibrary.list3({
          q: params.q || undefined,
          type: params.type || undefined,
          category: params.category || undefined,
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


