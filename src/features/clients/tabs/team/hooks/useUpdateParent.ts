import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';
import type { ClientParentUpdateRequest } from '@/types/api';

export function useUpdateParent(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parentId, requestBody }: { parentId: string; requestBody: ClientParentUpdateRequest }) => {
      const api = getApiClient();
      return await api.adminParents.updateClientParent({ clientId, parentId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Parent updated');
      await queryClient.invalidateQueries({ queryKey: teamKeys.parents(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to update parent');
    },
  });
}


