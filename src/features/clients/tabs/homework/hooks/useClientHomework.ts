import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { homeworkKeys } from '@/features/clients/tabs/homework/hooks/homeworkKeys';
import type { HomeworkResponse } from '@/types/api';

export function useClientHomework({ clientId, active }: { clientId: string; active: boolean }) {
  return useQuery<HomeworkResponse[]>({
    queryKey: homeworkKeys.list(clientId, active),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminHomework.getHomework({ clientId, active });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


