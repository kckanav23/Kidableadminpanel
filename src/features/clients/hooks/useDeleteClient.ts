import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { clientKeys } from '@/features/clients/hooks/clientKeys';

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      const api = getApiClient();
      await api.adminClients.deleteClient({ clientId });
    },
    onSuccess: async () => {
      toast.success('Client deleted');
      await queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete client');
    },
  });
}


