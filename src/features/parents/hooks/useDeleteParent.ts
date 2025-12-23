import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { parentKeys } from '@/features/parents/hooks/parentKeys';

export function useDeleteParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parentId: string): Promise<void> => {
      const api = getApiClient();
      await api.adminParents.deleteParent({ parentId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: parentKeys.lists() });
      toast.success('Parent deleted');
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to delete parent');
    },
  });
}


