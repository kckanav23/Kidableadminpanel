import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { goalKeys } from '@/features/clients/tabs/goals/hooks/goalKeys';
import type { GoalResponse, GoalUpdateRequest } from '@/types/api';

export function useUpdateGoal(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, requestBody }: { goalId: string; requestBody: GoalUpdateRequest }): Promise<GoalResponse> => {
      const api = getApiClient();
      return await api.adminGoals.updateGoal({ clientId, goalId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Goal updated successfully');
      await queryClient.invalidateQueries({ queryKey: goalKeys.all(clientId) });
    },
    onError: async (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to update goal');
    },
  });
}


