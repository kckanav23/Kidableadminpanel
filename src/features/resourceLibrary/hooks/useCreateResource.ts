import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { resourceLibraryKeys } from '@/features/resourceLibrary/hooks/resourceLibraryKeys';
import type { ResourceCreateRequest, ResourceLibraryResponse } from '@/types/api';

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: ResourceCreateRequest): Promise<ResourceLibraryResponse> => {
      const api = getApiClient();
      return await api.adminResourceLibrary.create3({ requestBody });
    },
    onSuccess: async () => {
      toast.success('Resource created successfully');
      await queryClient.invalidateQueries({ queryKey: resourceLibraryKeys.all });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to create resource');
    },
  });
}


