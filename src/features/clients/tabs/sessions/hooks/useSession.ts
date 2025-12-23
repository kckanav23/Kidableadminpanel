import { useQuery } from '@tanstack/react-query';

import { getApiClient, handleApiError } from '@/lib/api/client';
import { sessionKeys } from '@/features/clients/tabs/sessions/hooks/sessionKeys';
import type { SessionResponse } from '@/types/api';

export function useSession({
  clientId,
  sessionId,
  enabled = true,
}: {
  clientId: string;
  sessionId: string;
  enabled?: boolean;
}) {
  return useQuery<SessionResponse>({
    queryKey: sessionKeys.detail(clientId, sessionId),
    enabled: enabled && Boolean(clientId) && Boolean(sessionId),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminSessions.getSession({ clientId, sessionId });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


