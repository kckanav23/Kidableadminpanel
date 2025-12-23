import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { journalKeys } from '@/features/clients/tabs/journal/hooks/journalKeys';
import type { MoodEntryResponse } from '@/types/api';

export function useClientMoodEntries({ clientId, days }: { clientId: string; days: number }) {
  return useQuery<MoodEntryResponse[]>({
    queryKey: journalKeys.mood(clientId, days),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminClientMood.getMoodEntries1({ clientId, days });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


