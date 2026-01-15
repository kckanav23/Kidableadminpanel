import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { strategyLibraryKeys } from '@/features/strategyLibrary/hooks/strategyLibraryKeys';
import type { StrategyResponse, StrategyUpdateRequest } from '@/types/api';

export function useUpdateStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { strategyId: string; requestBody: StrategyUpdateRequest }): Promise<StrategyResponse> => {
      const api = getApiClient();
      return await api.adminStrategyLibrary.update1({ strategyId: payload.strategyId, requestBody: payload.requestBody });
    },
    onSuccess: async () => {
      toast.success('Strategy updated successfully');
      await queryClient.invalidateQueries({ queryKey: strategyLibraryKeys.all });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to update strategy');
    },
  });
}


