import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { therapistKeys, type StaffAccessCodesListParams } from '@/features/therapists/hooks/therapistKeys';
import type { StaffAccessCodeResponse } from '@/types/api';

export function useStaffAccessCodes(params: StaffAccessCodesListParams, options?: { enabled?: boolean }) {
  return useQuery<StaffAccessCodeResponse[]>({
    queryKey: therapistKeys.staffCodes(params),
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminStaffAccessCodes.list2({ userId: params.userId, active: params.active });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


