export const homeworkKeys = {
  all: (clientId: string) => ['clients', clientId, 'homework'] as const,
  list: (clientId: string, active: boolean) => [...homeworkKeys.all(clientId), 'list', active] as const,
};


