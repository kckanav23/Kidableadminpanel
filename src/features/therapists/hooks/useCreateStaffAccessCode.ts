import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { therapistKeys } from '@/features/therapists/hooks/therapistKeys';
import type { StaffAccessCodeCreateRequest, StaffAccessCodeResponse } from '@/types/api';

export function useCreateStaffAccessCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: StaffAccessCodeCreateRequest): Promise<StaffAccessCodeResponse> => {
      const api = getApiClient();
      return await api.adminStaffAccessCodes.create2({ requestBody });
    },
    onSuccess: async (res) => {
      if (res.userId) {
        await queryClient.invalidateQueries({ queryKey: therapistKeys.staffCodes({ userId: res.userId, active: true }) });
      }
      toast.success('Access code created successfully');
      if (res.code) {
        navigator.clipboard.writeText(res.code);
        toast.info('Access code copied to clipboard');
      }
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to create access code');
    },
  });
}


