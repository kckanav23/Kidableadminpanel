export type StrategyLibraryListParams = {
  q?: string;
  type?: string;
  global?: boolean;
  page?: number;
  size?: number;
};

export const strategyLibraryKeys = {
  all: ['strategy-library'] as const,
  lists: () => [...strategyLibraryKeys.all, 'list'] as const,
  list: (params: StrategyLibraryListParams) => [...strategyLibraryKeys.lists(), params] as const,
};


