import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { therapistKeys } from '@/features/therapists/hooks/therapistKeys';
import type { TherapistCreateRequest, TherapistResponse } from '@/types/api';

export function useCreateTherapist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: TherapistCreateRequest): Promise<TherapistResponse> => {
      const api = getApiClient();
      return await api.adminTherapists.create({ requestBody });
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: therapistKeys.lists() });
      toast.success('Therapist created successfully');
      if (res.accessCode) {
        navigator.clipboard.writeText(res.accessCode);
        toast.info('Access code copied to clipboard');
      }
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to create therapist');
    },
  });
}


