import { useMemo, useState } from 'react';
import { Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useStrategyLibrary } from '@/features/clients/tabs/strategies/hooks/useStrategyLibrary';
import { STRATEGY_TYPE_LABELS, ZONE_LABELS } from '@/lib/constants';
import type { StrategyResponse } from '@/types/api';
import type { StrategyType, Zone } from '@/types';

type StrategyTypeFilter = 'all' | 'antecedent' | 'reinforcement' | 'regulation';

function isStrategyTypeFilter(value: string): value is StrategyTypeFilter {
  return value === 'all' || value === 'antecedent' || value === 'reinforcement' || value === 'regulation';
}

export function AssignStrategyDialog({
  onAssign,
  onCancel,
  isSubmitting,
  assignedStrategyIds,
}: {
  onAssign: (payload: { strategyId: string; assignedDate?: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  assignedStrategyIds: string[];
}) {
  const [q, setQ] = useState('');
  const [type, setType] = useState<StrategyTypeFilter>('all');
  const [assignedDate, setAssignedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const libraryQuery = useStrategyLibrary({ q, type });
  const strategies = libraryQuery.data?.items || [];
  const assignedIdSet = useMemo(() => new Set(assignedStrategyIds), [assignedStrategyIds]);

  // Only allow assigning strategies that are:
  // - not global (global strategies are implicitly assigned)
  // - not already assigned to this client
  const assignableStrategies = useMemo(
    () => strategies.filter((s) => !!s.id && !s.global && !assignedIdSet.has(s.id)),
    [assignedIdSet, strategies]
  );

  const assign = (s: StrategyResponse) => {
    if (!s.id) return;
    onAssign({ strategyId: s.id, assignedDate: assignedDate || undefined });
  };

  const showEmpty = !libraryQuery.isLoading && assignableStrategies.length === 0;

  const header = useMemo(() => {
    if (libraryQuery.isLoading) return 'Searching…';
    if (showEmpty) return 'No strategies found';
    return `${assignableStrategies.length} results`;
  }, [assignableStrategies.length, libraryQuery.isLoading, showEmpty]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assignedDate">Assigned Date</Label>
          <Input id="assignedDate" type="date" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(v: string) => {
              if (isStrategyTypeFilter(v)) setType(v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="antecedent">Antecedent</SelectItem>
              <SelectItem value="reinforcement">Reinforcement</SelectItem>
              <SelectItem value="regulation">Regulation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search library</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input id="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search strategies…" className="pl-10" />
        </div>
      </div>

      <div className="text-sm text-slate-600">{header}</div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {libraryQuery.isLoading ? (
          <div className="py-10 text-center">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading strategies…</p>
          </div>
        ) : showEmpty ? (
          <div className="py-10 text-center text-slate-600">No assignable strategies match your search.</div>
        ) : (
          assignableStrategies.map((s) => {
            const typeLabel = s.type ? STRATEGY_TYPE_LABELS[String(s.type) as StrategyType] : 'Strategy';
            const zoneLabel = s.targetZone ? ZONE_LABELS[String(s.targetZone) as Zone] : null;

            return (
              <Card key={s.id}>
                <CardContent className="py-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{s.title || 'Untitled'}</p>
                      {s.type ? <Badge variant="outline">{typeLabel}</Badge> : null}
                      {zoneLabel ? <Badge variant="secondary">{zoneLabel}</Badge> : null}
                    </div>
                    {s.description ? <p className="text-sm text-slate-600 line-clamp-2 mt-1">{s.description}</p> : null}
                  </div>
                  <Button size="sm" className="bg-[#0B5B45] hover:bg-[#0D6953]" onClick={() => assign(s)} disabled={isSubmitting || !s.id}>
                    Assign
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}


