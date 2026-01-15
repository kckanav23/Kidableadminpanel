export const sessionKeys = {
  all: (clientId: string) => ['clients', clientId, 'sessions'] as const,
  list: (clientId: string, limit: number) => [...sessionKeys.all(clientId), 'list', limit] as const,
  detail: (clientId: string, sessionId: string) => [...sessionKeys.all(clientId), 'detail', sessionId] as const,
};


