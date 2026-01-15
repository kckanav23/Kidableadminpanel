import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { homeworkKeys } from '@/features/clients/tabs/homework/hooks/homeworkKeys';
import type { HomeworkCreateRequest, HomeworkResponse } from '@/types/api';

export function useCreateHomework(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: HomeworkCreateRequest): Promise<HomeworkResponse> => {
      const api = getApiClient();
      return await api.adminHomework.createHomework({ clientId, requestBody });
    },
    onSuccess: async () => {
      toast.success('Homework assigned successfully');
      await queryClient.invalidateQueries({ queryKey: homeworkKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to assign homework');
    },
  });
}


