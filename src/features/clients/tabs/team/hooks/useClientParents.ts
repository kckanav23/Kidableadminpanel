import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';
import type { ClientParentResponse } from '@/types/api';

export function useClientParents(clientId: string) {
  return useQuery<ClientParentResponse[]>({
    queryKey: teamKeys.parents(clientId),
    queryFn: async () => {
      const api = getApiClient();
      return await api.adminParents.listClientParents({ clientId });
    },
  });
}


