import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api/client';
import { clientKeys } from '@/features/clients/hooks/clientKeys';
import type { ClientProfileResponse } from '@/types/api';

export function useClient(clientId?: string) {
  return useQuery<ClientProfileResponse>({
    queryKey: clientId ? clientKeys.detail(clientId) : clientKeys.detail('missing'),
    enabled: Boolean(clientId),
    queryFn: async () => {
      const api = getApiClient();
      if (!clientId) throw new Error('Missing clientId');
      return await api.adminClients.getClient({ clientId });
    },
  });
}


