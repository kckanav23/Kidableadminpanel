import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { sessionKeys } from '@/features/clients/tabs/sessions/hooks/sessionKeys';

export function useDeleteSession(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }): Promise<void> => {
      const api = getApiClient();
      await api.adminSessions.deleteSession({ clientId, sessionId });
    },
    onSuccess: async (_data, variables) => {
      toast.success('Session deleted');
      queryClient.removeQueries({ queryKey: sessionKeys.detail(clientId, variables.sessionId) });
      await queryClient.invalidateQueries({ queryKey: sessionKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to delete session');
    },
  });
}


