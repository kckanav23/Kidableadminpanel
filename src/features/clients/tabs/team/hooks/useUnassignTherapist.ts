import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';

export function useUnassignTherapist(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (therapistId: string) => {
      const api = getApiClient();
      await api.adminClientTherapists.unassign1({ clientId, therapistId });
    },
    onSuccess: async () => {
      toast.success('Therapist removed successfully');
      await queryClient.invalidateQueries({ queryKey: teamKeys.therapists(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to remove therapist');
    },
  });
}


