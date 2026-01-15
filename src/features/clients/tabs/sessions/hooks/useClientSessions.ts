import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { sessionKeys } from '@/features/clients/tabs/sessions/hooks/sessionKeys';
import type { SessionResponse } from '@/types/api';

export function useClientSessions({ clientId, limit = 100 }: { clientId: string; limit?: number }) {
  return useQuery<SessionResponse[]>({
    queryKey: sessionKeys.list(clientId, limit),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminSessions.getSessions({ clientId, limit });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


