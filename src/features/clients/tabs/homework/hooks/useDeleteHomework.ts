import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { homeworkKeys } from '@/features/clients/tabs/homework/hooks/homeworkKeys';

export function useDeleteHomework(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (homeworkId: string) => {
      const api = getApiClient();
      await api.adminHomework.deleteHomework({ clientId, homeworkId });
    },
    onSuccess: async () => {
      toast.success('Homework deleted successfully');
      await queryClient.invalidateQueries({ queryKey: homeworkKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to delete homework');
    },
  });
}


