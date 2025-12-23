export type AuditLogListParams = {
  resourceType?: string;
  userId?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  /**
   * Local-only search applied client-side after fetching.
   * (Backend list endpoint doesn't currently support free-text search.)
   */
  q?: string;
};

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (params: AuditLogListParams) => [...auditLogKeys.lists(), params] as const,
};


