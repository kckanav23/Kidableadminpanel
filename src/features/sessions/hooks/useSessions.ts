import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getApiClient, handleApiError } from '@/lib/api/client';
import { sessionKeys, type SessionsListParams } from '@/features/sessions/hooks/sessionKeys';
import type { PageResponseSessionResponse } from '@/types/api';

export function useSessions(params: SessionsListParams) {
  return useQuery<PageResponseSessionResponse>({
    queryKey: sessionKeys.list(params),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminSessions.listSessions({
          therapistId: params.therapistId || undefined,
          all: params.all ?? false,
          page: params.page,
          size: params.size ?? 20,
        });
      } catch (error) {
        return await handleApiError(error);
      }
    },
    placeholderData: keepPreviousData,
  });
}


