import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { resourceLibraryKeys } from '@/features/resourceLibrary/hooks/resourceLibraryKeys';
import type { ResourceLibraryResponse, ResourceUpdateRequest } from '@/types/api';

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { resourceId: string; requestBody: ResourceUpdateRequest }): Promise<ResourceLibraryResponse> => {
      const api = getApiClient();
      return await api.adminResourceLibrary.update2({ resourceId: payload.resourceId, requestBody: payload.requestBody });
    },
    onSuccess: async () => {
      toast.success('Resource updated successfully');
      await queryClient.invalidateQueries({ queryKey: resourceLibraryKeys.all });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to update resource');
    },
  });
}


