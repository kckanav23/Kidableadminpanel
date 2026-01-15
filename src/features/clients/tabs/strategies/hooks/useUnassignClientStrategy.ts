import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { strategyKeys } from '@/features/clients/tabs/strategies/hooks/strategyKeys';

export function useUnassignClientStrategy(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (strategyId: string) => {
      const api = getApiClient();
      await api.adminStrategyLibrary.unassign({ clientId, strategyId });
    },
    onSuccess: async () => {
      toast.success('Strategy unassigned successfully');
      await queryClient.invalidateQueries({ queryKey: strategyKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to unassign strategy');
    },
  });
}


