import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { therapistKeys, type TherapistsListParams } from '@/features/therapists/hooks/therapistKeys';
import type { PageResponseTherapistResponse } from '@/types/api';

export function useTherapists(params: TherapistsListParams) {
  return useQuery<PageResponseTherapistResponse>({
    queryKey: therapistKeys.list(params),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminTherapists.list({
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


