import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { auditLogKeys, type AuditLogListParams } from '@/features/auditLogs/hooks/auditLogKeys';
import type { AuditLogResponse, PageResponseAuditLogResponse } from '@/types/api';

function matchesLocalQuery(log: AuditLogResponse, q: string): boolean {
  const query = q.toLowerCase();
  return (
    (log.performedBy || '').toLowerCase().includes(query) ||
    (log.action || '').toLowerCase().includes(query) ||
    JSON.stringify(log.details || {}).toLowerCase().includes(query)
  );
}

export function useAuditLogs(params: AuditLogListParams) {
  return useQuery<PageResponseAuditLogResponse & { items?: AuditLogResponse[] }>({
    queryKey: auditLogKeys.list(params),
    queryFn: async () => {
      try {
        const api = getApiClient();
        const res = await api.adminAuditLog.list7({
          resourceType: params.resourceType,
          userId: params.userId,
          from: params.from,
          to: params.to,
          page: params.page,
          size: params.size ?? 100,
        });

        const items = (res.items || [])
          .filter((log) => (params.q ? matchesLocalQuery(log, params.q) : true))
          .sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));

        return { ...res, items };
      } catch (error) {
        return await handleApiError(error);
      }
    },
    placeholderData: keepPreviousData,
  });
}


