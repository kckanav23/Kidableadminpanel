import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';

export function useRemoveParent(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parentId: string) => {
      const api = getApiClient();
      await api.adminParents.deleteClientParent({ clientId, parentId });
    },
    onSuccess: async () => {
      toast.success('Parent removed successfully');
      await queryClient.invalidateQueries({ queryKey: teamKeys.parents(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to remove parent');
    },
  });
}


