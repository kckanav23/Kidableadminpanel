export const teamKeys = {
  all: (clientId: string) => ['clients', 'team', clientId] as const,
  therapists: (clientId: string) => [...teamKeys.all(clientId), 'therapists'] as const,
  parents: (clientId: string) => [...teamKeys.all(clientId), 'parents'] as const,
  therapistPicklist: (clientId: string) => [...teamKeys.all(clientId), 'picklist', 'therapists'] as const,
  parentPicklist: (clientId: string) => [...teamKeys.all(clientId), 'picklist', 'parents'] as const,
};


