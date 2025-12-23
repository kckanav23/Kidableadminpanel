import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { teamKeys } from '@/features/clients/tabs/team/hooks/teamKeys';

export function useAssignTherapist(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      therapistId,
      primary,
      action = 'assign',
    }: {
      therapistId: string;
      primary: boolean;
      action?: 'assign' | 'set_primary' | 'unset_primary';
    }) => {
      const api = getApiClient();
      return await api.adminClientTherapists.assign({
        clientId,
        requestBody: {
          therapistId,
          primary,
          // Backwards/forwards compatibility: some backend versions use `isPrimary`.
          ...( { isPrimary: primary } as unknown as Record<string, unknown> ),
        },
      });
    },
    onSuccess: async (_data, variables) => {
      if (variables.action === 'set_primary') {
        toast.success('Primary therapist updated');
      } else if (variables.action === 'unset_primary') {
        toast.success('Primary therapist removed');
      } else {
        toast.success(variables.primary ? 'Therapist assigned (primary)' : 'Therapist assigned successfully');
      }
      await queryClient.invalidateQueries({ queryKey: teamKeys.therapists(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to assign therapist');
    },
  });
}


