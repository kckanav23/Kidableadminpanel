import { useMemo, useState } from 'react';
import { Eye, Globe, Loader2, Plus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormDialog } from '@/components/common/FormDialog';
import { STRATEGY_TYPE_LABELS } from '@/lib/constants';

import type { StrategyAssignToClientRequest, StrategyResponse } from '@/types/api';
import type { StrategyType } from '@/types';
import { useClientStrategies } from '@/features/clients/tabs/strategies/hooks/useClientStrategies';
import { useAssignClientStrategy } from '@/features/clients/tabs/strategies/hooks/useAssignClientStrategy';
import { useUnassignClientStrategy } from '@/features/clients/tabs/strategies/hooks/useUnassignClientStrategy';
import { AssignStrategyDialog } from '@/features/clients/tabs/strategies/components/AssignStrategyDialog';
import { StrategyViewDialog } from '@/features/strategyLibrary/components/StrategyViewDialog';

export function StrategiesTab({ clientId }: { clientId: string }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'assigned' | 'all'>('assigned');
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingStrategy, setViewingStrategy] = useState<StrategyResponse | null>(null);

  const strategiesQuery = useClientStrategies(clientId, viewMode);
  const grouped = strategiesQuery.data || {};

  const assign = useAssignClientStrategy(clientId);
  const unassign = useUnassignClientStrategy(clientId);
  const isSubmitting = assign.isPending || unassign.isPending;

  const allStrategies: StrategyResponse[] = useMemo(
    () => [...(grouped.antecedent || []), ...(grouped.reinforcement || []), ...(grouped.regulation || [])],
    [grouped.antecedent, grouped.reinforcement, grouped.regulation]
  );

  // Backend now supports `scope=assigned|all`. We fetch the correct dataset (assigned-only vs assigned+global),
  // so no additional client-side filtering is needed here.
  const displayStrategies = allStrategies;

  const groupedDisplay = useMemo(() => {
    const pick = (type: StrategyType) => {
      const list = (grouped[type] || []) as StrategyResponse[];
      return list;
    };
    return {
      antecedent: pick('antecedent'),
      reinforcement: pick('reinforcement'),
      regulation: pick('regulation'),
    };
  }, [grouped]);

  const countLabel = useMemo(() => `${displayStrategies.length} Strategies`, [displayStrategies.length]);

  const assignedStrategyIds = useMemo(() => allStrategies.filter((s) => !!s.id && !s.global).map((s) => s.id!) as string[], [allStrategies]);

  const submitAssign = async (payload: { strategyId: string; assignedDate?: string }) => {
    const requestBody: StrategyAssignToClientRequest = { strategyId: payload.strategyId, assignedDate: payload.assignedDate };
    await assign.mutateAsync(requestBody);
    setAssignOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl">{countLabel}</h2>
          <Button
            type="button"
            variant={viewMode === 'assigned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('assigned')}
            className={viewMode === 'assigned' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            Assigned only
          </Button>
          <Button type="button" variant={viewMode === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('all')}>
            Show all
          </Button>
        </div>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]" onClick={() => setAssignOpen(true)} disabled={isSubmitting}>
          <Plus className="size-4" />
          Assign Strategy
        </Button>
      </div>

      {strategiesQuery.isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading strategies...</p>
          </CardContent>
        </Card>
      ) : displayStrategies.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No strategies assigned yet</p>
            <Button variant="outline" className="gap-2" onClick={() => setAssignOpen(true)} disabled={isSubmitting}>
              <Plus className="size-4" />
              Assign First Strategy
            </Button>
          </CardContent>
        </Card>
      ) : (
        (Object.keys(groupedDisplay) as StrategyType[]).map(
          (type) =>
            groupedDisplay[type].length > 0 && (
              <div key={type}>
                <h3 className="text-sm text-slate-600 mb-3">{STRATEGY_TYPE_LABELS[type]}</h3>
                <div className="space-y-4">
                  {groupedDisplay[type].map((strategy) => {
                    return (
                      <Card key={strategy.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="size-4 text-[#0B5B45]" />
                                <CardTitle className="text-lg">{strategy.title || 'Untitled'}</CardTitle>
                              </div>
                              {strategy.description ? <p className="text-sm text-slate-600">{strategy.description}</p> : null}
                            </div>
                            <Badge variant="outline" className="text-[#0B5B45] border-[#0B5B45]">
                              {type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* StrategyResponse no longer includes assigned metadata (assignedDate/customNotes/effectiveness) in v4 */}

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                setViewingStrategy(strategy);
                                setViewOpen(true);
                              }}
                            >
                              <Eye className="size-4" />
                              View Details
                            </Button>
                            {strategy.id && !strategy.global ? (
                              <Button variant="ghost" size="sm" onClick={() => unassign.mutate(strategy.id!)} disabled={isSubmitting}>
                                Unassign
                              </Button>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )
        )
      )}

      <FormDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        title="Assign Strategy"
        description="Pick a strategy from the library and assign it to this client."
        maxWidth="2xl"
      >
        <AssignStrategyDialog
          onAssign={submitAssign}
          onCancel={() => setAssignOpen(false)}
          isSubmitting={isSubmitting}
          assignedStrategyIds={assignedStrategyIds}
        />
      </FormDialog>

      <StrategyViewDialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) setViewingStrategy(null);
        }}
        strategy={viewingStrategy}
      />
    </div>
  );
}


