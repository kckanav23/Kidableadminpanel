import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { clientKeys } from '@/features/clients/hooks/clientKeys';
import type { ClientProfileResponse, ClientUpdateRequest } from '@/types/api';

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clientId,
      requestBody,
    }: {
      clientId: string;
      requestBody: ClientUpdateRequest;
    }): Promise<ClientProfileResponse> => {
      const api = getApiClient();
      return await api.adminClients.updateClient({ clientId, requestBody });
    },
    onSuccess: async (_data, variables) => {
      toast.success('Client updated');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: clientKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) }),
      ]);
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error(error instanceof Error ? error.message : 'Failed to update client');
    },
  });
}


