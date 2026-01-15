import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { goalKeys } from '@/features/clients/tabs/goals/hooks/goalKeys';
import type { GoalProgressCreateRequest, GoalProgressResponse } from '@/types/api';

export function useLogGoalProgress(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, requestBody }: { goalId: string; requestBody: GoalProgressCreateRequest }) => {
      const api = getApiClient();
      // OpenAPI v4 currently omits `clientId` from the generated AdminGoalsService method signature
      // even though it's present in the path. Use the underlying request to safely include it.
      return await api.request.request<GoalProgressResponse>({
        method: 'POST',
        url: '/admin/clients/{clientId}/goals/{goalId}/progress',
        path: { clientId, goalId },
        body: requestBody,
        mediaType: 'application/json',
      });
    },
    onSuccess: async () => {
      toast.success('Progress logged successfully');
      await queryClient.invalidateQueries({ queryKey: goalKeys.all(clientId) });
    },
    onError: async (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to log progress');
    },
  });
}


