export type SessionsListParams = {
  all?: boolean;
  therapistId?: string;
  page?: number;
  size?: number;
};

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (params: SessionsListParams) => [...sessionKeys.lists(), params] as const,
};


