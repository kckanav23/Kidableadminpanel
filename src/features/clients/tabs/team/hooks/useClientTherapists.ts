import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';
import type { ClientTherapistResponse } from '@/types/api';

export function useClientTherapists(clientId: string) {
  return useQuery<ClientTherapistResponse[]>({
    queryKey: teamKeys.therapists(clientId),
    queryFn: async () => {
      const api = getApiClient();
      return await api.adminClientTherapists.list5({ clientId });
    },
  });
}


