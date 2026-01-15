import { useMemo } from 'react';
import { useClientGoals } from '@/features/clients/tabs/goals/hooks/useClientGoals';

export function useHomeworkGoalsPicklist(clientId: string) {
  const goalsQuery = useClientGoals({ clientId, status: 'active' });

  const goals = useMemo(() => {
    const data = goalsQuery.data || [];
    return data
      .map((g) => ({ id: g.id || '', title: g.title }))
      .filter((g) => Boolean(g.id));
  }, [goalsQuery.data]);

  return { ...goalsQuery, goals };
}


