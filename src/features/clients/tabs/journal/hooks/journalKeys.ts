export const journalKeys = {
  mood: (clientId: string, days: number) => ['clients', clientId, 'mood', days] as const,
  journal: (clientId: string, limit: number) => ['clients', clientId, 'journal', limit] as const,
};


