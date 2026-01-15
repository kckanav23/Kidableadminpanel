import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { parentKeys } from '@/features/parents/hooks/parentKeys';
import type { ParentAccessCodeCreateRequest, ParentAccessCodeResponse } from '@/types/api';

export function useCreateParentAccessCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { parentId: string; requestBody: ParentAccessCodeCreateRequest }): Promise<ParentAccessCodeResponse> => {
      const api = getApiClient();
      return await api.adminParentAccessCodes.create4({ parentId: input.parentId, requestBody: input.requestBody });
    },
    onSuccess: async (_res, input) => {
      await queryClient.invalidateQueries({
        queryKey: parentKeys.accessCodes({ parentId: input.parentId, active: true }),
      });
      toast.success('Access code created successfully');
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to create access code');
    },
  });
}


