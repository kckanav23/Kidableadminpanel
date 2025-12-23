import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { parentKeys } from '@/features/parents/hooks/parentKeys';

export function useRevokeParentAccessCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { parentId: string; accessCodeId: string }): Promise<void> => {
      const api = getApiClient();
      await api.adminParentAccessCodes.delete2({ parentId: input.parentId, accessCodeId: input.accessCodeId });
    },
    onSuccess: async (_res, input) => {
      await queryClient.invalidateQueries({
        queryKey: parentKeys.accessCodes({ parentId: input.parentId, active: true }),
      });
      toast.success('Access code revoked');
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to revoke access code');
    },
  });
}


