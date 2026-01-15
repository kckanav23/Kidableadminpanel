import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { resourceKeys } from '@/features/clients/tabs/resources/hooks/resourceKeys';

export function useUnassignClientResource(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      const api = getApiClient();
      await api.adminResourceLibrary.unassign2({ clientId, resourceId });
    },
    onSuccess: async () => {
      toast.success('Resource unassigned successfully');
      await queryClient.invalidateQueries({ queryKey: resourceKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to unassign resource');
    },
  });
}


