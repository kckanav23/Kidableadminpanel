export type ResourceLibraryListParams = {
  q?: string;
  type?: string;
  category?: string;
  global?: boolean;
  page?: number;
  size?: number;
};

export const resourceLibraryKeys = {
  all: ['resource-library'] as const,
  lists: () => [...resourceLibraryKeys.all, 'list'] as const,
  list: (params: ResourceLibraryListParams) => [...resourceLibraryKeys.lists(), params] as const,
};


