import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { therapistKeys } from '@/features/therapists/hooks/therapistKeys';

export function useRevokeStaffAccessCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; userId: string }): Promise<void> => {
      const api = getApiClient();
      await api.adminStaffAccessCodes.revoke({ id: input.id });
    },
    onSuccess: async (_res, input) => {
      await queryClient.invalidateQueries({ queryKey: therapistKeys.staffCodes({ userId: input.userId, active: true }) });
      toast.success('Access code revoked');
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to revoke access code');
    },
  });
}


