import { useMemo, useState } from 'react';
import { Calendar, Edit, Eye, Loader2, Plus, Target, Trash2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TherapyBadge } from '@/components/badges/TherapyBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormDialog } from '@/components/common/FormDialog';
import { formatDate } from '@/lib/utils';
import type { HomeworkCompletionRequest, HomeworkCreateRequest, HomeworkResponse, HomeworkUpdateRequest } from '@/types/api';
import { HomeworkCompletionRequest as HomeworkCompletionRequestNs, HomeworkCreateRequest as HomeworkCreateRequestNs, HomeworkUpdateRequest as HomeworkUpdateRequestNs } from '@/types/api';

import { HomeworkForm, type HomeworkFormData } from '@/features/clients/tabs/homework/components/HomeworkForm';
import { HomeworkCompletionForm, type HomeworkCompletionData } from '@/features/clients/tabs/homework/components/HomeworkCompletionForm';
import { HomeworkCompletionHistory } from '@/features/clients/tabs/homework/components/HomeworkCompletionHistory';
import { useClientHomework } from '@/features/clients/tabs/homework/hooks/useClientHomework';
import { useCreateHomework } from '@/features/clients/tabs/homework/hooks/useCreateHomework';
import { useDeleteHomework } from '@/features/clients/tabs/homework/hooks/useDeleteHomework';
import { useHomeworkGoalsPicklist } from '@/features/clients/tabs/homework/hooks/useHomeworkGoalsPicklist';
import { useLogHomeworkCompletion } from '@/features/clients/tabs/homework/hooks/useLogHomeworkCompletion';
import { useUpdateHomework } from '@/features/clients/tabs/homework/hooks/useUpdateHomework';

const STATUS_COLORS: Record<string, string> = {
  worked: 'text-green-700 border-green-700',
  not_worked: 'text-red-700 border-red-700',
  yet_to_try: 'text-yellow-700 border-yellow-700',
  not_started: 'text-slate-600 border-slate-300',
};

const STATUS_LABELS: Record<string, string> = {
  worked: 'Worked',
  not_worked: 'Not Worked',
  yet_to_try: 'Yet to Try',
  not_started: 'Not Started',
};

function inferDataType(frequency?: string): HomeworkCreateRequest.dataType {
  if (!frequency) return HomeworkCreateRequestNs.dataType.FREQUENCY;
  const lower = frequency.toLowerCase();
  if (lower.includes('min') || lower.includes('minute')) return HomeworkCreateRequestNs.dataType.DURATION;
  return HomeworkCreateRequestNs.dataType.FREQUENCY;
}

function toTherapyEnum(value: HomeworkFormData['therapy']) {
  if (value === 'ABA') return HomeworkCreateRequestNs.therapy.ABA;
  if (value === 'Speech') return HomeworkCreateRequestNs.therapy.SPEECH;
  return HomeworkCreateRequestNs.therapy.OT;
}

function toStatusEnum(value: HomeworkFormData['status']) {
  if (value === 'worked') return HomeworkCreateRequestNs.status.WORKED;
  if (value === 'not_worked') return HomeworkCreateRequestNs.status.NOT_WORKED;
  if (value === 'yet_to_try') return HomeworkCreateRequestNs.status.YET_TO_TRY;
  return HomeworkCreateRequestNs.status.NOT_STARTED;
}

function toCompletionStatusEnum(value: HomeworkCompletionData['status']) {
  if (value === 'worked') return HomeworkCompletionRequestNs.status.WORKED;
  if (value === 'not_worked') return HomeworkCompletionRequestNs.status.NOT_WORKED;
  if (value === 'yet_to_try') return HomeworkCompletionRequestNs.status.YET_TO_TRY;
  return HomeworkCompletionRequestNs.status.NOT_STARTED;
}

function getHomeworkType(hw: HomeworkResponse): 'frequency' | 'duration' | 'general' {
  if (hw.dataType === 'frequency') return 'frequency';
  if (hw.dataType === 'duration') return 'duration';
  return 'general';
}

export function HomeworkTab({ clientId }: { clientId: string }) {
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const activeParam = filter === 'active';

  const homeworkQuery = useClientHomework({ clientId, active: activeParam });
  const homework = homeworkQuery.data || [];

  const goalsPicklist = useHomeworkGoalsPicklist(clientId);

  const createHomework = useCreateHomework(clientId);
  const updateHomework = useUpdateHomework(clientId);
  const deleteHomework = useDeleteHomework(clientId);
  const logCompletion = useLogHomeworkCompletion(clientId);

  const isSubmitting = createHomework.isPending || updateHomework.isPending || deleteHomework.isPending || logCompletion.isPending;

  const [homeworkFormOpen, setHomeworkFormOpen] = useState(false);
  const [completionFormOpen, setCompletionFormOpen] = useState(false);
  const [viewLogOpen, setViewLogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingHomeworkId, setEditingHomeworkId] = useState<string | null>(null);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string | null>(null);
  const [selectedLogHomeworkId, setSelectedLogHomeworkId] = useState<string | null>(null);

  const editingHomework = editingHomeworkId ? homework.find((h) => h.id === editingHomeworkId) || null : null;
  const selectedHomework = selectedHomeworkId ? homework.find((h) => h.id === selectedHomeworkId) || null : null;
  const selectedLogHomework = selectedLogHomeworkId ? homework.find((h) => h.id === selectedLogHomeworkId) || null : null;

  const displayHomework = useMemo(() => {
    if (filter === 'active') return homework.filter((h) => h.isActive !== false);
    return homework;
  }, [filter, homework]);

  const openCreate = () => {
    setEditingHomeworkId(null);
    setHomeworkFormOpen(true);
  };

  const openEdit = (hwId: string) => {
    setEditingHomeworkId(hwId);
    setHomeworkFormOpen(true);
  };

  const openDelete = (hwId: string) => {
    setSelectedHomeworkId(hwId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedHomework?.id) return;
    await deleteHomework.mutateAsync(selectedHomework.id);
    setDeleteDialogOpen(false);
    setSelectedHomeworkId(null);
  };

  const submitHomework = async (data: HomeworkFormData) => {
    const instructions = data.instructions ? data.instructions.split('\n').filter(Boolean) : [];
    const requestCommon = {
      title: data.title,
      description: data.description || undefined,
      instructions,
      frequency: data.frequencyTarget || undefined,
      relatedGoalId: data.relatedGoalId || undefined,
      therapy: toTherapyEnum(data.therapy),
      status: toStatusEnum(data.status),
      assignedDate: data.assignedDate,
      dueDate: data.dueDate,
      active: data.isActive,
    };

    if (!editingHomework?.id) {
      const request: HomeworkCreateRequest = {
        ...requestCommon,
        dataType: inferDataType(data.frequencyTarget),
      };
      await createHomework.mutateAsync(request);
    } else {
      const request: HomeworkUpdateRequest = {
        ...requestCommon,
        dataType: inferDataType(data.frequencyTarget) as HomeworkUpdateRequestNs.dataType,
      };
      await updateHomework.mutateAsync({ homeworkId: editingHomework.id, requestBody: request });
    }

    setHomeworkFormOpen(false);
    setEditingHomeworkId(null);
  };

  const openLogCompletion = (hwId: string) => {
    setSelectedHomeworkId(hwId);
    setCompletionFormOpen(true);
  };

  const submitCompletion = async (data: HomeworkCompletionData) => {
    if (!selectedHomework?.id) return;
    const request: HomeworkCompletionRequest = {
      completionDate: data.completionDate,
      frequencyCount: data.frequencyCount,
      durationMinutes: data.durationMinutes,
      status: toCompletionStatusEnum(data.status),
      notes: data.notes,
      loggedByParent: data.loggedByParent,
    };
    await logCompletion.mutateAsync({ homeworkId: selectedHomework.id, requestBody: request });
    setCompletionFormOpen(false);
    setSelectedHomeworkId(null);
  };

  const openViewLog = (hwId: string) => {
    setSelectedLogHomeworkId(hwId);
    setViewLogOpen(true);
  };

  const initialHomeworkFormData: Partial<HomeworkFormData> | undefined =
    editingHomework
      ? {
          clientId,
          title: editingHomework.title,
          description: editingHomework.description || '',
          therapy: (editingHomework.therapy || 'ABA') as HomeworkFormData['therapy'],
          frequencyTarget: editingHomework.frequency || '',
          assignedDate: editingHomework.assignedDate || new Date().toISOString().split('T')[0],
          dueDate: editingHomework.dueDate,
          status: (editingHomework.status || 'not_started') as HomeworkFormData['status'],
          isActive: editingHomework.isActive ?? true,
          instructions: (editingHomework.instructions || []).join('\n'),
          relatedGoalId: editingHomework.relatedGoalId,
        }
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(v: string) => setFilter(v === 'active' ? 'active' : 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]" disabled={isSubmitting}>
          <Plus className="size-4" />
          Assign Homework
        </Button>
      </div>

      {homeworkQuery.isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading homework...</p>
          </CardContent>
        </Card>
      ) : displayHomework.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No homework assigned yet</p>
            <Button variant="outline" className="gap-2" onClick={openCreate} disabled={isSubmitting}>
              <Plus className="size-4" />
              Assign First Homework
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayHomework.map((hw) => {
            const status = hw.status || 'not_started';
            const statusColor = STATUS_COLORS[status] || STATUS_COLORS.not_started;
            const statusLabel = STATUS_LABELS[status] || STATUS_LABELS.not_started;

            return (
              <Card key={hw.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TherapyBadge type={((hw.therapy || 'ABA').toLowerCase() as 'aba' | 'speech' | 'ot')} showLabel={false} />
                        <CardTitle className="text-lg">{hw.title}</CardTitle>
                      </div>
                      {hw.description ? <p className="text-sm text-slate-600">{hw.description}</p> : null}
                    </div>
                    <Badge variant="outline" className={statusColor}>
                      {statusLabel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hw.purpose ? (
                    <p className="text-sm">
                      <span className="text-slate-600">Purpose: </span>
                      {hw.purpose}
                    </p>
                  ) : null}

                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    {hw.assignedDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-slate-400" />
                        <span className="text-slate-600">Assigned:</span>
                        <span>{formatDate(new Date(hw.assignedDate))}</span>
                      </div>
                    ) : null}
                    {hw.dueDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-slate-400" />
                        <span className="text-slate-600">Due:</span>
                        <span>{formatDate(new Date(hw.dueDate))}</span>
                      </div>
                    ) : null}
                    {hw.relatedGoal ? (
                      <div className="flex items-center gap-2">
                        <Target className="size-4 text-slate-400" />
                        <span className="text-slate-600">Goal:</span>
                        <span className="truncate">{hw.relatedGoal.title}</span>
                      </div>
                    ) : null}
                    {hw.assignedByUser ? (
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-slate-400" />
                        <span className="text-slate-600">Assigned by:</span>
                        <span>{hw.assignedByUser.fullName || '—'}</span>
                      </div>
                    ) : null}
                  </div>

                  {hw.frequency ? (
                    <div className="pt-2 border-t text-sm">
                      <span className="text-slate-600">Frequency: </span>
                      <span className="font-medium">{hw.frequency}</span>
                    </div>
                  ) : null}

                  {hw.homeworkCompletions && hw.homeworkCompletions.length > 0 ? (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="text-slate-600">Completions: </span>
                        <span className="font-medium">{hw.homeworkCompletions.length} times logged</span>
                      </p>
                    </div>
                  ) : null}

                  <div className="flex gap-2 pt-2 flex-wrap">
                    {hw.homeworkCompletions && hw.homeworkCompletions.length > 0 ? (
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => openViewLog(hw.id!)} disabled={isSubmitting}>
                        <Eye className="size-4" />
                        View Log
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => openLogCompletion(hw.id!)} disabled={isSubmitting}>
                      <Plus className="size-4" />
                      Log Completion
                    </Button>
                    {hw.id ? (
                      <>
                        <Button variant="ghost" size="sm" className="gap-2" onClick={() => openEdit(hw.id!)} disabled={isSubmitting}>
                          <Edit className="size-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => openDelete(hw.id!)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <FormDialog
        open={homeworkFormOpen}
        onOpenChange={(open) => {
          setHomeworkFormOpen(open);
          if (!open) setEditingHomeworkId(null);
        }}
        title={editingHomework ? 'Edit Homework' : 'Assign Homework'}
        description={editingHomework ? 'Update homework assignment details' : 'Create a new homework assignment for this client'}
        maxWidth="2xl"
      >
        <HomeworkForm
          clientId={clientId}
          onSubmit={submitHomework}
          onCancel={() => {
            setHomeworkFormOpen(false);
            setEditingHomeworkId(null);
          }}
          initialData={initialHomeworkFormData}
          availableGoals={goalsPicklist.goals}
        />
      </FormDialog>

      <FormDialog
        open={completionFormOpen}
        onOpenChange={(open) => {
          setCompletionFormOpen(open);
          if (!open) setSelectedHomeworkId(null);
        }}
        title="Log Homework Completion"
        description="Record how this homework activity went"
        maxWidth="lg"
      >
        <HomeworkCompletionForm
          onSubmit={submitCompletion}
          onCancel={() => {
            setCompletionFormOpen(false);
            setSelectedHomeworkId(null);
          }}
          homeworkTitle={selectedHomework?.title}
          homeworkType={selectedHomework ? getHomeworkType(selectedHomework) : 'general'}
        />
      </FormDialog>

      {selectedLogHomework ? (
        <FormDialog
          open={viewLogOpen}
          onOpenChange={(open) => {
            setViewLogOpen(open);
            if (!open) setSelectedLogHomeworkId(null);
          }}
          title="Homework Completion Log"
          description="View all completion entries for this homework"
          maxWidth="3xl"
        >
          <HomeworkCompletionHistory
            homework={selectedLogHomework}
            onClose={() => {
              setViewLogOpen(false);
              setSelectedLogHomeworkId(null);
            }}
          />
        </FormDialog>
      ) : null}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedHomeworkId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete homework assignment?"
        description={
          selectedHomework?.title
            ? `Are you sure you want to delete "${selectedHomework.title}"? This action cannot be undone.`
            : 'Are you sure you want to delete this homework assignment? This action cannot be undone.'
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}


