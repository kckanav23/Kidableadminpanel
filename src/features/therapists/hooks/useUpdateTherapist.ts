import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { therapistKeys } from '@/features/therapists/hooks/therapistKeys';
import type { TherapistResponse, TherapistUpdateRequest } from '@/types/api';

export function useUpdateTherapist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { therapistId: string; requestBody: TherapistUpdateRequest }): Promise<TherapistResponse> => {
      const api = getApiClient();
      return await api.adminTherapists.update({ therapistId: input.therapistId, requestBody: input.requestBody });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: therapistKeys.lists() });
      toast.success('Therapist updated successfully');
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to update therapist');
    },
  });
}


