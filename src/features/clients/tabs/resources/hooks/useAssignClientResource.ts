import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { resourceKeys } from '@/features/clients/tabs/resources/hooks/resourceKeys';
import type { ResourceAssignToClientRequest, ResourceLibraryResponse } from '@/types/api';

export function useAssignClientResource(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: ResourceAssignToClientRequest): Promise<ResourceLibraryResponse> => {
      const api = getApiClient();
      return await api.adminResourceLibrary.assign2({ clientId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Resource assigned successfully');
      await queryClient.invalidateQueries({ queryKey: resourceKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to assign resource');
    },
  });
}


