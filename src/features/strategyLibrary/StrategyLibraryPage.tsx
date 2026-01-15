import { useEffect, useMemo, useState } from 'react';
import { Edit, Eye, Loader2, Plus, Trash2 } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { STRATEGY_TYPE_LABELS, ZONE_LABELS } from '@/lib/constants';

import type { StrategyResponse } from '@/types/api';
import type { StrategyFormData, StrategyTypeFilter } from '@/features/strategyLibrary/types';
import { StrategyLibraryFilters } from '@/features/strategyLibrary/components/StrategyLibraryFilters';
import { StrategyViewDialog } from '@/features/strategyLibrary/components/StrategyViewDialog';
import { StrategyFormDialog } from '@/features/strategyLibrary/components/StrategyFormDialog';
import { useStrategyLibraryList } from '@/features/strategyLibrary/hooks/useStrategyLibraryList';
import { useCreateStrategy } from '@/features/strategyLibrary/hooks/useCreateStrategy';
import { useUpdateStrategy } from '@/features/strategyLibrary/hooks/useUpdateStrategy';
import { useDeleteStrategy } from '@/features/strategyLibrary/hooks/useDeleteStrategy';
import { buildCreateRequest, buildUpdateRequest } from '@/features/strategyLibrary/utils/mappers';

export function StrategyLibraryPage() {
  useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<StrategyTypeFilter>('all');

  const [viewingStrategy, setViewingStrategy] = useState<StrategyResponse | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<StrategyResponse | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Match existing behavior: debounce only when user types something.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, searchQuery ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const listQuery = useStrategyLibraryList({
    q: debouncedSearchQuery.trim() ? debouncedSearchQuery.trim() : undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    size: 100,
  });

  const strategies = listQuery.data?.items || [];
  const loading = listQuery.isLoading || listQuery.isFetching;

  const createStrategy = useCreateStrategy();
  const updateStrategy = useUpdateStrategy();
  const deleteStrategy = useDeleteStrategy();

  const isSubmitting = createStrategy.isPending || updateStrategy.isPending || deleteStrategy.isPending;

  const handleOpenAdd = () => setIsAddOpen(true);

  const handleOpenEdit = (strategy: StrategyResponse) => {
    setEditingStrategy(strategy);
    setIsEditOpen(true);
  };

  const handleOpenView = (strategy: StrategyResponse) => {
    setViewingStrategy(strategy);
    setIsViewOpen(true);
  };

  const handleSubmitAdd = async (data: StrategyFormData) => {
    if (!data.title.trim()) {
      toast.error('Title is required');
      return;
    }
    await createStrategy.mutateAsync(buildCreateRequest(data));
    setIsAddOpen(false);
  };

  const handleSubmitEdit = async (data: StrategyFormData) => {
    if (!editingStrategy?.id) return;
    if (!data.title.trim()) {
      toast.error('Title is required');
      return;
    }
    await updateStrategy.mutateAsync({ strategyId: editingStrategy.id, requestBody: buildUpdateRequest(data) });
    setIsEditOpen(false);
    setEditingStrategy(null);
  };

  const handleDelete = async (strategy: StrategyResponse) => {
    if (!strategy.id) return;
    if (!confirm(`Are you sure you want to delete "${strategy.title}"? This action cannot be undone.`)) return;
    await deleteStrategy.mutateAsync(strategy.id);
  };

  const emptyMessage = useMemo(() => {
    if (searchQuery || typeFilter !== 'all') return 'No strategies found matching your filters';
    return 'No strategies found';
  }, [searchQuery, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Strategy Library</h1>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={handleOpenAdd}>
          <Plus className="size-4" />
          New Strategy
        </Button>
      </div>

      <StrategyLibraryFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle>{strategies.length} Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading strategies...</span>
            </div>
          ) : strategies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">{emptyMessage}</p>
              {(searchQuery || typeFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {strategies.map((strategy) => {
                const strategyType = strategy.type?.toLowerCase() as 'antecedent' | 'reinforcement' | 'regulation' | undefined;
                const typeLabel = strategyType ? STRATEGY_TYPE_LABELS[strategyType] : strategy.type || 'Unknown';

                return (
                  <Card key={strategy.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{strategy.title || 'Untitled'}</CardTitle>
                            <Badge variant="outline" className="text-teal-700 border-teal-700">
                              {typeLabel}
                            </Badge>
                            {strategy.targetZone ? (
                              <Badge variant="secondary" className="capitalize">
                                {ZONE_LABELS[strategy.targetZone as keyof typeof ZONE_LABELS]}
                              </Badge>
                            ) : null}
                          </div>
                          {strategy.description ? <p className="text-sm text-slate-600">{strategy.description}</p> : null}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {strategy.whenToUse ? (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">When to Use</p>
                          <p className="text-sm">{strategy.whenToUse}</p>
                        </div>
                      ) : null}

                      {strategy.howToUse ? (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">How to Use</p>
                          <p className="text-sm whitespace-pre-line">{strategy.howToUse}</p>
                        </div>
                      ) : null}

                      {strategy.steps && strategy.steps.length > 0 ? (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Steps</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {strategy.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {strategy.examples && strategy.examples.length > 0 ? (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Examples</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {strategy.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => handleOpenView(strategy)} disabled={isSubmitting}>
                          <Eye className="size-4" />
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(strategy)} disabled={isSubmitting}>
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(strategy)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <StrategyViewDialog open={isViewOpen} onOpenChange={setIsViewOpen} strategy={viewingStrategy} />

      <StrategyFormDialog
        mode="create"
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        isSubmitting={isSubmitting}
        initialStrategy={null}
        onSubmit={handleSubmitAdd}
        globalDefault={true}
      />

      <StrategyFormDialog
        mode="edit"
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditingStrategy(null);
        }}
        isSubmitting={isSubmitting}
        initialStrategy={editingStrategy}
        onSubmit={handleSubmitEdit}
        globalDefault={true}
      />
    </div>
  );
}


