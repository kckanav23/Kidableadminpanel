import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';
import type { ParentResponse, TherapistResponse } from '@/types/api';

export function useTherapistPicklist({ clientId, enabled }: { clientId: string; enabled: boolean }) {
  return useQuery<TherapistResponse[]>({
    queryKey: teamKeys.therapistPicklist(clientId),
    enabled,
    queryFn: async () => {
      const api = getApiClient();
      const res = await api.adminTherapists.list({ size: 10 });
      return res.items || [];
    },
  });
}

export function useParentPicklist({ clientId, enabled }: { clientId: string; enabled: boolean }) {
  return useQuery<ParentResponse[]>({
    queryKey: teamKeys.parentPicklist(clientId),
    enabled,
    queryFn: async () => {
      const api = getApiClient();
      const res = await api.adminParents.list6({ size: 10 });
      return res.items || [];
    },
  });
}


