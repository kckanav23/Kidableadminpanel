export type ParentsListParams = {
  q?: string;
  status?: string;
  page?: number;
  size?: number;
};

export type ParentAccessCodesListParams = {
  parentId: string;
  clientId?: string;
  active?: boolean;
};

export const parentKeys = {
  all: ['parents'] as const,
  lists: () => [...parentKeys.all, 'list'] as const,
  list: (params: ParentsListParams) => [...parentKeys.lists(), params] as const,
  accessCodes: (params: ParentAccessCodesListParams) => [...parentKeys.all, 'access-codes', params] as const,
};


