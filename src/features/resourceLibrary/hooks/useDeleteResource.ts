import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { resourceLibraryKeys } from '@/features/resourceLibrary/hooks/resourceLibraryKeys';

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      const api = getApiClient();
      await api.adminResourceLibrary.delete1({ resourceId });
    },
    onSuccess: async () => {
      toast.success('Resource deleted successfully');
      await queryClient.invalidateQueries({ queryKey: resourceLibraryKeys.all });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to delete resource');
    },
  });
}


