import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiClient, handleApiErrorSilently } from '@/lib/api/client';
import { sessionKeys } from '@/features/clients/tabs/sessions/hooks/sessionKeys';
import type { SessionCreateRequest, SessionResponse } from '@/types/api';
import { normalizePromptType } from '@/features/clients/tabs/sessions/utils/sessionMappers';

export function useCreateSession(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestBody,
      activities,
    }: {
      requestBody: SessionCreateRequest;
      activities?: Array<{ sequenceOrder: number; activity: string; antecedent?: string; behaviour?: string; consequences?: string; promptType?: string }>;
    }): Promise<SessionResponse> => {
      const api = getApiClient();
      const created = await api.adminSessions.createSession({
        clientId,
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
                    promptType: normalizePromptType(a.promptType),
                  }))
              : requestBody.sessionActivities,
        },
      });

      const sessionId = created.id;

      // The create endpoint often returns a session without activities.
      // Fetch the full session (including activities) so UI/edit flows remain consistent.
      return sessionId ? await api.adminSessions.getSession({ clientId, sessionId }) : created;
    },
    onSuccess: async (data) => {
      toast.success('Session created successfully');
      if (data.id) {
        queryClient.setQueryData(sessionKeys.detail(clientId, data.id), data);
      }
      await queryClient.invalidateQueries({ queryKey: sessionKeys.all(clientId) });
    },
    onError: (error) => {
      handleApiErrorSilently(error);
      toast.error('Failed to create session');
    },
  });
}


