import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { homeworkKeys } from '@/features/clients/tabs/homework/hooks/homeworkKeys';
import type { HomeworkResponse, HomeworkUpdateRequest } from '@/types/api';

export function useUpdateHomework(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ homeworkId, requestBody }: { homeworkId: string; requestBody: HomeworkUpdateRequest }): Promise<HomeworkResponse> => {
      const api = getApiClient();
      return await api.adminHomework.updateHomework({ clientId, homeworkId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Homework updated successfully');
      await queryClient.invalidateQueries({ queryKey: homeworkKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to update homework');
    },
  });
}


