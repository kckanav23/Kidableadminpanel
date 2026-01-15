import { useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { journalKeys } from '@/features/clients/tabs/journal/hooks/journalKeys';
import type { JournalEntryResponse } from '@/types/api';

export function useClientJournalEntries({ clientId, limit = 100 }: { clientId: string; limit?: number }) {
  return useQuery<JournalEntryResponse[]>({
    queryKey: journalKeys.journal(clientId, limit),
    queryFn: async () => {
      try {
        const api = getApiClient();
        return await api.adminClientJournal.getJournalEntries({ clientId, limit });
      } catch (error) {
        return await handleApiError(error);
      }
    },
  });
}


