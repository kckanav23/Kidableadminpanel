export const strategyKeys = {
  all: (clientId: string) => ['clients', clientId, 'strategies'] as const,
  grouped: (clientId: string, scope: 'all' | 'assigned') => [...strategyKeys.all(clientId), 'grouped', scope] as const,
  library: (q: string, type: string) => ['strategy-library', q, type] as const,
};


