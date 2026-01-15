import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { goalKeys } from '@/features/clients/tabs/goals/hooks/goalKeys';
import type { GoalCreateRequest, GoalResponse } from '@/types/api';

export function useCreateGoal(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: GoalCreateRequest): Promise<GoalResponse> => {
      const api = getApiClient();
      return await api.adminGoals.createGoal({ clientId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Goal created successfully');
      await queryClient.invalidateQueries({ queryKey: goalKeys.all(clientId) });
    },
    onError: async (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to create goal');
    },
  });
}


