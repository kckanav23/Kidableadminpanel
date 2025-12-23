import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { strategyLibraryKeys } from '@/features/strategyLibrary/hooks/strategyLibraryKeys';
import type { StrategyCreateRequest, StrategyResponse } from '@/types/api';

export function useCreateStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: StrategyCreateRequest): Promise<StrategyResponse> => {
      const api = getApiClient();
      return await api.adminStrategyLibrary.create1({ requestBody });
    },
    onSuccess: async () => {
      toast.success('Strategy created successfully');
      await queryClient.invalidateQueries({ queryKey: strategyLibraryKeys.all });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to create strategy');
    },
  });
}


