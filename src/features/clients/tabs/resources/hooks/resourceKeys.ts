export const resourceKeys = {
  all: (clientId: string) => ['clients', clientId, 'resources'] as const,
  list: (clientId: string, scope: 'all' | 'assigned') => [...resourceKeys.all(clientId), 'list', scope] as const,
  library: (q: string, type: string) => ['resource-library', q, type] as const,
};


