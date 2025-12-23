import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { strategyKeys } from '@/features/clients/tabs/strategies/hooks/strategyKeys';
import type { StrategyAssignToClientRequest, StrategyResponse } from '@/types/api';

export function useAssignClientStrategy(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: StrategyAssignToClientRequest): Promise<StrategyResponse> => {
      const api = getApiClient();
      return await api.adminStrategyLibrary.assign1({ clientId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Strategy assigned successfully');
      await queryClient.invalidateQueries({ queryKey: strategyKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to assign strategy');
    },
  });
}


