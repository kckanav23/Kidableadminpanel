import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { sessionKeys } from '@/features/clients/tabs/sessions/hooks/sessionKeys';
import type { SessionResponse, SessionUpdateRequest } from '@/types/api';
import { normalizePromptType } from '@/features/clients/tabs/sessions/utils/sessionMappers';

export function useUpdateSession(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      requestBody,
      activities,
      existingActivityIds: _existingActivityIds,
    }: {
      sessionId: string;
      requestBody: SessionUpdateRequest;
      activities?: Array<{ sequenceOrder: number; activity: string; antecedent?: string; behaviour?: string; consequences?: string; promptType?: string }>;
      existingActivityIds?: string[];
    }): Promise<SessionResponse> => {
      const api = getApiClient();
      const updated = await api.adminSessions.updateSession({
        clientId,
        sessionId,
        requestBody: {
          ...requestBody,
          sessionActivities:
            activities && activities.length > 0
              ? activities
                  .filter((a) => a.activity && a.activity.trim().length > 0)
                  .map((a) => ({
                    sequenceOrder: a.sequenceOrder,
                    activity: a.activity,
                    antecedent: a.antecedent || undefined,
                    behaviour: a.behaviour || undefined,
                    consequences: a.consequences || undefined,
                    // Enum values match between create/update DTOs.
                    promptType: normalizePromptType(a.promptType) as any,
                  }))
              : requestBody.sessionActivities,
        },
      });

      // Ensure we return a fully hydrated session including activities.
      return await api.adminSessions.getSession({ clientId, sessionId });
    },
    onSuccess: async (data) => {
      toast.success('Session updated successfully');
      if (data.id) {
        queryClient.setQueryData(sessionKeys.detail(clientId, data.id), data);
      }
      await queryClient.invalidateQueries({ queryKey: sessionKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to update session');
    },
  });
}


