import { useResourceLibraryList } from '@/features/resourceLibrary/hooks/useResourceLibraryList';

export function useResourceLibrary({ q, type }: { q: string; type: string }) {
  // Intentionally re-use the resource library feature hook + keys so the cache is shared across the app.
  return useResourceLibraryList({
    q: q.trim() ? q.trim() : undefined,
    type: type !== 'all' ? type : undefined,
    size: 100,
  });
}


