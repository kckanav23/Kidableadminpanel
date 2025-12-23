import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { resourceKeys } from '@/features/clients/tabs/resources/hooks/resourceKeys';
import type { ResourceLibraryResponse } from '@/types/api';

export type ClientResourceScope = 'all' | 'assigned';

export function useClientResources(clientId: string, scope: ClientResourceScope) {
  return useQuery<ResourceLibraryResponse[]>({
    queryKey: resourceKeys.list(clientId, scope),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminResourceLibrary.getResources1({ clientId, scope });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


