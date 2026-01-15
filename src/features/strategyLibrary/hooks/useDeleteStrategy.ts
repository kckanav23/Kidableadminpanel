import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { strategyLibraryKeys } from '@/features/strategyLibrary/hooks/strategyLibraryKeys';

export function useDeleteStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (strategyId: string) => {
      const api = getApiClient();
      await api.adminStrategyLibrary.delete({ strategyId });
    },
    onSuccess: async () => {
      toast.success('Strategy deleted successfully');
      await queryClient.invalidateQueries({ queryKey: strategyLibraryKeys.all });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to delete strategy');
    },
  });
}


