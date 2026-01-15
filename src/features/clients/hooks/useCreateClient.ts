import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { clientKeys } from '@/features/clients/hooks/clientKeys';
import type { ClientProfileResponse } from '@/types/api';
import { mapClientFormToCreateRequests, type ClientFormData } from '@/features/clients/clientForm';

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClientFormData): Promise<ClientProfileResponse> => {
      const api = getApiClient();
      const { createClientRequest, therapistAssignment, parentAssignment } = mapClientFormToCreateRequests(data);

      const clientResponse = await api.adminClients.createClient({
        requestBody: createClientRequest,
      });

      const clientId = clientResponse.id;
      if (!clientId) throw new Error('Client ID not returned from API');

      // Assign therapist if selected
      if (therapistAssignment) {
        try {
          await api.adminClientTherapists.assign({
            clientId,
            requestBody: therapistAssignment,
          });
        } catch (err) {
          console.error(err);
          toast.warning('Client created but therapist assignment failed');
        }
      }

      // Assign parent if requested
      if (parentAssignment) {
        try {
          await api.adminParents.createClientParent({
            clientId,
            requestBody: parentAssignment,
          });
        } catch (err) {
          console.error(err);
          toast.warning('Client created but parent assignment failed');
        }
      }

      return clientResponse;
    },
    onSuccess: async () => {
      toast.success('Client created successfully!');
      await queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error(error instanceof Error ? error.message : 'Failed to create client');
    },
  });
}


