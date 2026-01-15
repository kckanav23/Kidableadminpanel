import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api/client';
import { clientKeys } from '@/features/clients/hooks/clientKeys';
import type { ParentResponse, TherapistResponse } from '@/types/api';

export function useClientPicklists({ enabled }: { enabled: boolean }) {
  return useQuery<{ therapists: TherapistResponse[]; parents: ParentResponse[] }>({
    queryKey: clientKeys.picklists(),
    enabled,
    queryFn: async () => {
      const api = getApiClient();
      const [therapistsData, parentsData] = await Promise.all([
        api.adminTherapists.list({ size: 100 }),
        api.adminParents.list6({ size: 100 }),
      ]);

      return {
        therapists: therapistsData.items || [],
        parents: parentsData.items || [],
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}


