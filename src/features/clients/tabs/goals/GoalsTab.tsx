import { useMemo, useState } from 'react';
import { Edit, Loader2, Plus, Trash2, TrendingUp } from 'lucide-react';

import type { Goal } from '@/types';
import type { GoalCreateRequest, GoalUpdateRequest } from '@/types/api';
import { GoalCreateRequest as GoalCreateRequestNs, GoalUpdateRequest as GoalUpdateRequestNs } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TherapyBadge } from '@/components/badges/TherapyBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormDialog } from '@/components/common/FormDialog';

import { GoalForm, type GoalFormData } from '@/features/clients/tabs/goals/components/GoalForm';
import { GoalProgressView } from '@/features/clients/tabs/goals/components/GoalProgressView';
import { LogProgressForm, type ProgressLogData } from '@/features/clients/tabs/goals/components/LogProgressForm';
import { useClientGoals } from '@/features/clients/tabs/goals/hooks/useClientGoals';
import { useCreateGoal } from '@/features/clients/tabs/goals/hooks/useCreateGoal';
import { useDeleteGoal } from '@/features/clients/tabs/goals/hooks/useDeleteGoal';
import { useLogGoalProgress } from '@/features/clients/tabs/goals/hooks/useLogGoalProgress';
import { useUpdateGoal } from '@/features/clients/tabs/goals/hooks/useUpdateGoal';
import { mapGoalProgressToEntries, mapGoalResponseToGoal } from '@/features/clients/tabs/goals/utils/goalMappers';

type StatusFilter = 'all' | 'active' | 'achieved' | 'on_hold' | 'discontinued';

function isStatusFilter(value: string): value is StatusFilter {
  return value === 'all' || value === 'active' || value === 'achieved' || value === 'on_hold' || value === 'discontinued';
}

function toTherapyEnum(value: GoalFormData['therapy']) {
  if (value === 'ABA') return GoalCreateRequestNs.therapy.ABA;
  if (value === 'Speech') return GoalCreateRequestNs.therapy.SPEECH;
  return GoalCreateRequestNs.therapy.OT;
}

function toStatusEnum(value: GoalFormData['status']) {
  if (value === 'active') return GoalCreateRequestNs.status.ACTIVE;
  if (value === 'achieved') return GoalCreateRequestNs.status.ACHIEVED;
  if (value === 'on_hold') return GoalCreateRequestNs.status.ON_HOLD;
  return GoalCreateRequestNs.status.DISCONTINUED;
}

export function GoalsTab({ clientId }: { clientId: string }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const goalsQuery = useClientGoals({ clientId, status: statusFilter === 'all' ? undefined : statusFilter });
  const apiGoals = goalsQuery.data || [];

  const goals = useMemo(() => apiGoals.map(mapGoalResponseToGoal), [apiGoals]);

  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [viewingGoalId, setViewingGoalId] = useState<string | null>(null);
  const [progressViewOpen, setProgressViewOpen] = useState(false);
  const [logProgressOpen, setLogProgressOpen] = useState(false);

  const editingGoal: Goal | null = editingGoalId ? goals.find((g) => g.id === editingGoalId) || null : null;
  const editingApiGoal = editingGoalId ? apiGoals.find((g) => g.id === editingGoalId) || null : null;
  const viewingGoal: Goal | null = viewingGoalId ? goals.find((g) => g.id === viewingGoalId) || null : null;
  const viewingApiGoal = viewingGoalId ? apiGoals.find((g) => g.id === viewingGoalId) || null : null;

  const createGoal = useCreateGoal(clientId);
  const updateGoal = useUpdateGoal(clientId);
  const deleteGoal = useDeleteGoal(clientId);
  const logProgress = useLogGoalProgress(clientId);

  const isSubmitting = createGoal.isPending || updateGoal.isPending || deleteGoal.isPending || logProgress.isPending;

  const openCreate = () => {
    setEditingGoalId(null);
    setGoalFormOpen(true);
  };

  const openEdit = (goalId: string) => {
    setEditingGoalId(goalId);
    setGoalFormOpen(true);
  };

  const openDelete = (goalId: string) => {
    setSelectedGoalId(goalId);
    setDeleteDialogOpen(true);
  };

  const submitCreate = async (data: GoalFormData) => {
    const request: GoalCreateRequest = {
      title: data.title,
      description: data.description,
      therapy: toTherapyEnum(data.therapy),
      targetCriteria: data.targetCriteria || undefined,
      baselineValue: data.baselineValue ? parseFloat(data.baselineValue) : undefined,
      targetValue: data.targetValue ? parseFloat(data.targetValue) : undefined,
      status: toStatusEnum(data.status),
      startDate: data.startDate,
      targetDate: data.targetDate,
    };

    await createGoal.mutateAsync(request);
    setGoalFormOpen(false);
    setEditingGoalId(null);
  };

  const submitUpdate = async (data: GoalFormData) => {
    if (!editingGoalId) return;

    const request: GoalUpdateRequest = {
      title: data.title,
      description: data.description,
      therapy: data.therapy === 'ABA' ? GoalUpdateRequestNs.therapy.ABA : data.therapy === 'Speech' ? GoalUpdateRequestNs.therapy.SPEECH : GoalUpdateRequestNs.therapy.OT,
      targetCriteria: data.targetCriteria || undefined,
      baselineValue: data.baselineValue ? parseFloat(data.baselineValue) : undefined,
      targetValue: data.targetValue ? parseFloat(data.targetValue) : undefined,
      status:
        data.status === 'active'
          ? GoalUpdateRequestNs.status.ACTIVE
          : data.status === 'achieved'
          ? GoalUpdateRequestNs.status.ACHIEVED
          : data.status === 'on_hold'
          ? GoalUpdateRequestNs.status.ON_HOLD
          : GoalUpdateRequestNs.status.DISCONTINUED,
      startDate: data.startDate,
      targetDate: data.targetDate,
      achievedDate: data.achievedDate,
    };

    await updateGoal.mutateAsync({ goalId: editingGoalId, requestBody: request });
    setGoalFormOpen(false);
    setEditingGoalId(null);
  };

  const confirmDelete = async () => {
    if (!selectedGoalId) return;
    await deleteGoal.mutateAsync(selectedGoalId);
    setDeleteDialogOpen(false);
    setSelectedGoalId(null);
  };

  const openProgressView = (goalId: string) => {
    setViewingGoalId(goalId);
    setProgressViewOpen(true);
  };

  const openLogProgress = (goalId: string) => {
    setViewingGoalId(goalId);
    setLogProgressOpen(true);
  };

  const submitProgress = async (data: ProgressLogData) => {
    if (!viewingGoalId) return;
    await logProgress.mutateAsync({
      goalId: viewingGoalId,
      requestBody: {
        value: data.value,
        recordedDate: data.date,
        notes: data.notes,
      },
    });
    setLogProgressOpen(false);
    setViewingGoalId(null);
  };

  const selectedGoalTitle = selectedGoalId ? goals.find((g) => g.id === selectedGoalId)?.title : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={statusFilter}
            onValueChange={(v: string) => {
              if (isStatusFilter(v)) setStatusFilter(v);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="achieved">Achieved</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          Add Goal
        </Button>
      </div>

      {goalsQuery.isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading goals...</p>
          </CardContent>
        </Card>
      ) : goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No goals found</p>
            <Button variant="outline" onClick={openCreate}>
              Add First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = ((goal.current - goal.baseline) / (goal.target - goal.baseline)) * 100;
            const progressClamped = Math.max(0, Math.min(100, progress));

            return (
              <Card key={goal.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TherapyBadge type={goal.therapyType} showLabel={false} />
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </div>
                      <p className="text-sm text-slate-600">{goal.description}</p>
                      {goal.targetCriteria ? (
                        <p className="text-xs text-slate-500 mt-2">
                          <span className="font-medium text-slate-600">Target criteria:</span> {goal.targetCriteria}
                        </p>
                      ) : null}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        goal.status === 'active'
                          ? 'text-green-700 border-green-700'
                          : goal.status === 'achieved'
                          ? 'text-blue-700 border-blue-700'
                          : 'text-slate-600 border-slate-300'
                      }
                    >
                      {goal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="font-medium">{Math.round(progressClamped)}%</span>
                    </div>
                    <Progress value={progressClamped} className="h-2" />
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-slate-600">Baseline: </span>
                      <span className="font-medium">{goal.baseline}%</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Current: </span>
                      <span className="font-medium">{goal.current}%</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Target: </span>
                      <span className="font-medium">{goal.target}%</span>
                    </div>
                    {goal.dueDate ? (
                      <div>
                        <span className="text-slate-600">Due: </span>
                        <span className="font-medium">{formatDate(goal.dueDate)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => openProgressView(goal.id)} disabled={isSubmitting}>
                      <TrendingUp className="size-4" />
                      View Progress
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => openLogProgress(goal.id)} disabled={isSubmitting}>
                      <Plus className="size-4" />
                      Log Progress
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => openEdit(goal.id)} disabled={isSubmitting}>
                      <Edit className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => openDelete(goal.id)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <FormDialog
        open={goalFormOpen}
        onOpenChange={(open) => {
          setGoalFormOpen(open);
          if (!open) setEditingGoalId(null);
        }}
        title={editingGoal ? 'Edit Goal' : 'Add Goal'}
        description={editingGoal ? 'Update goal details and progress criteria' : 'Create a new therapy goal for this client'}
        maxWidth="2xl"
      >
        <GoalForm
          clientId={clientId}
          onSubmit={editingGoal ? submitUpdate : submitCreate}
          onCancel={() => {
            setGoalFormOpen(false);
            setEditingGoalId(null);
          }}
          initialData={
            editingGoal
              ? {
                  clientId,
                  title: editingGoal.title,
                  description: editingGoal.description,
                  therapy: editingGoal.therapyType === 'aba' ? 'ABA' : editingGoal.therapyType === 'speech' ? 'Speech' : 'OT',
                  targetCriteria: editingApiGoal?.targetCriteria ?? editingGoal.targetCriteria,
                  baselineValue: String(editingApiGoal?.baselineValue ?? editingGoal.baseline),
                  targetValue: String(editingApiGoal?.targetValue ?? editingGoal.target),
                  status: (editingApiGoal?.status as GoalFormData['status']) || (editingGoal.status === 'on-hold' ? 'on_hold' : editingGoal.status),
                  startDate: editingApiGoal?.startDate || editingGoal.createdDate.toISOString().split('T')[0],
                  targetDate: editingApiGoal?.targetDate || editingGoal.dueDate?.toISOString().split('T')[0],
                  achievedDate: editingApiGoal?.achievedDate,
                }
              : undefined
          }
        />
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete goal?"
        description={
          selectedGoalTitle
            ? `Are you sure you want to delete "${selectedGoalTitle}"? This action cannot be undone.`
            : 'Are you sure you want to delete this goal? This action cannot be undone.'
        }
        confirmLabel="Delete"
        variant="danger"
      />

      {viewingGoal && viewingApiGoal ? (
        <FormDialog
          open={progressViewOpen}
          onOpenChange={(open) => {
            setProgressViewOpen(open);
            if (!open) setViewingGoalId(null);
          }}
          title="Goal Progress"
          description="Track progress and view historical data"
          maxWidth="3xl"
        >
          <GoalProgressView
            goal={viewingGoal}
            progressEntries={mapGoalProgressToEntries(viewingApiGoal.id || viewingGoal.id, viewingApiGoal.goalProgress)}
            onClose={() => {
              setProgressViewOpen(false);
              setViewingGoalId(null);
            }}
          />
        </FormDialog>
      ) : null}

      {viewingGoal ? (
        <FormDialog
          open={logProgressOpen}
          onOpenChange={(open) => {
            setLogProgressOpen(open);
            if (!open) setViewingGoalId(null);
          }}
          title="Log Progress"
          description="Record a new progress measurement"
          maxWidth="xl"
        >
          <LogProgressForm
            goal={viewingGoal}
            onSubmit={submitProgress}
            onCancel={() => {
              setLogProgressOpen(false);
              setViewingGoalId(null);
            }}
          />
        </FormDialog>
      ) : null}
    </div>
  );
}


