export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (clientId: string) => [...clientKeys.details(), clientId] as const,
  picklists: () => [...clientKeys.all, 'picklists'] as const,
};


