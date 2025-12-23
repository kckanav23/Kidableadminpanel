import { useStrategyLibraryList } from '@/features/strategyLibrary/hooks/useStrategyLibraryList';

export function useStrategyLibrary({ q, type }: { q: string; type: string }) {
  // Intentionally re-use the strategy library feature hook + keys so the cache is shared across the app.
  return useStrategyLibraryList({
    q: q.trim() ? q.trim() : undefined,
    type: type !== 'all' ? type : undefined,
    size: 100,
  });
}


