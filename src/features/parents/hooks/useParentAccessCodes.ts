import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { parentKeys, type ParentAccessCodesListParams } from '@/features/parents/hooks/parentKeys';
import type { ParentAccessCodeResponse } from '@/types/api';

export function useParentAccessCodes(params: ParentAccessCodesListParams, options?: { enabled?: boolean }) {
  return useQuery<ParentAccessCodeResponse[]>({
    queryKey: parentKeys.accessCodes(params),
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminParentAccessCodes.list4({
          parentId: params.parentId,
          clientId: params.clientId,
          active: params.active,
        });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


