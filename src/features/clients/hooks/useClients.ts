import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api/client';
import { clientKeys } from '@/features/clients/hooks/clientKeys';
import type { ClientPageResponse } from '@/types/api';

export type UseClientsParams = {
  q?: string;
  status?: string;
  therapy?: string;
  page?: number;
  size?: number;
  mine?: boolean;
};

export function useClients(params: UseClientsParams) {
  return useQuery<ClientPageResponse>({
    queryKey: clientKeys.list(params),
    queryFn: async () => {
      const api = getApiClient();
      return await api.adminClients.listClients({
        q: params.q || undefined,
        status: params.status || undefined,
        therapy: params.therapy || undefined,
        page: params.page,
        size: params.size ?? 20,
        mine: params.mine ?? false,
      });
    },
    placeholderData: keepPreviousData,
  });
}


