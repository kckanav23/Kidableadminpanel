export const goalKeys = {
  all: (clientId: string) => ['clients', clientId, 'goals'] as const,
  list: (clientId: string, status?: string) => [...goalKeys.all(clientId), 'list', status ?? 'all'] as const,
};


