import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { homeworkKeys } from '@/features/clients/tabs/homework/hooks/homeworkKeys';
import type { HomeworkCompletionRequest } from '@/types/api';

export function useLogHomeworkCompletion(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ homeworkId, requestBody }: { homeworkId: string; requestBody: HomeworkCompletionRequest }) => {
      const api = getApiClient();
      return await api.adminHomework.logCompletion1({ clientId, homeworkId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Completion logged successfully');
      await queryClient.invalidateQueries({ queryKey: homeworkKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to log completion');
    },
  });
}


