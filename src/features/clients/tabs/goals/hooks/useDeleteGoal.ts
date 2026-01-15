import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { goalKeys } from '@/features/clients/tabs/goals/hooks/goalKeys';

export function useDeleteGoal(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      const api = getApiClient();
      await api.adminGoals.deleteGoal({ clientId, goalId });
    },
    onSuccess: async () => {
      toast.success('Goal deleted successfully');
      await queryClient.invalidateQueries({ queryKey: goalKeys.all(clientId) });
    },
    onError: async (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to delete goal');
    },
  });
}


