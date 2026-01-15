import { useMemo, useState } from 'react';
import { Activity, CheckCircle2, ChevronDown, Edit, Heart, Lightbulb, Loader2, MessageSquare, Plus, Tag, Target, Trash2, XCircle } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormDialog } from '@/components/common/FormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { TherapyBadge } from '@/components/badges/TherapyBadge';
import { ZoneBadge } from '@/components/badges/ZoneBadge';
import { formatDateTime } from '@/lib/utils';

import { SessionForm, type SessionFormData } from '@/features/clients/tabs/sessions/components/SessionForm';
import { useClientSessions } from '@/features/clients/tabs/sessions/hooks/useClientSessions';
import { useCreateSession } from '@/features/clients/tabs/sessions/hooks/useCreateSession';
import { useUpdateSession } from '@/features/clients/tabs/sessions/hooks/useUpdateSession';
import { useDeleteSession } from '@/features/clients/tabs/sessions/hooks/useDeleteSession';
import { mapSessionResponseToSession } from '@/features/clients/tabs/sessions/utils/sessionMappers';
import { getApiClient, handleApiError } from '@/lib/api/client';
import { sessionKeys } from '@/features/clients/tabs/sessions/hooks/sessionKeys';
import type { SessionCreateRequest, SessionUpdateRequest } from '@/types/api';
import { SessionCreateRequest as SessionCreateRequestNs, SessionUpdateRequest as SessionUpdateRequestNs } from '@/types/api';
import type { SessionResponse } from '@/types/api';

function getNextSessionNumber(sessionNumbers: number[]) {
  if (sessionNumbers.length === 0) return 1;
  return Math.max(...sessionNumbers) + 1;
}

function toTherapyEnum(value: SessionFormData['therapy']) {
  if (value === 'ABA') return SessionCreateRequestNs.therapy.ABA;
  if (value === 'Speech') return SessionCreateRequestNs.therapy.SPEECH;
  return SessionCreateRequestNs.therapy.OT;
}

function toZoneEnum(value?: SessionFormData['zone']) {
  if (!value) return undefined;
  if (value === 'green') return SessionCreateRequestNs.zone.GREEN;
  if (value === 'yellow') return SessionCreateRequestNs.zone.YELLOW;
  if (value === 'orange') return SessionCreateRequestNs.zone.ORANGE;
  if (value === 'red') return SessionCreateRequestNs.zone.RED;
  return SessionCreateRequestNs.zone.BLUE;
}

export function SessionsTab({ clientId }: { clientId: string }) {
  const sessionsQuery = useClientSessions({ clientId, limit: 100 });
  const apiSessions = sessionsQuery.data || [];

  const sessions = useMemo(() => apiSessions.map(mapSessionResponseToSession), [apiSessions]);
  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [sessions]
  );

  const sessionNumbers = useMemo(() => sessions.map((s) => s.sessionNumber).filter((n) => typeof n === 'number'), [sessions]);

  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [sessionFormOpen, setSessionFormOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const editingSession = editingSessionId ? sessions.find((s) => s.id === editingSessionId) || null : null;
  const editingApiSession = editingSessionId ? apiSessions.find((s) => s.id === editingSessionId) || null : null;

  // We only fetch full session details (with activities) for sessions that are expanded OR being edited.
  // This avoids N+1 for the entire list while fixing "missing activities" and edit duplication issues.
  const detailSessionIds = useMemo(() => {
    const ids = new Set<string>();
    expandedSessions.forEach((id) => {
      if (id) ids.add(id);
    });
    if (editingSessionId) ids.add(editingSessionId);
    return Array.from(ids);
  }, [expandedSessions, editingSessionId]);

  const detailQueries = useQueries({
    queries: detailSessionIds.map((sessionId) => ({
      queryKey: sessionKeys.detail(clientId, sessionId),
      enabled: Boolean(clientId) && Boolean(sessionId),
      queryFn: async (): Promise<SessionResponse> => {
        try {
          const api = getApiClient();
          return await api.adminSessions.getSession({ clientId, sessionId });
        } catch (error) {
          return await handleApiError(error);
        }
      },
    })),
  });

  const detailById = useMemo(() => {
    const map = new Map<string, SessionResponse>();
    detailSessionIds.forEach((id, idx) => {
      const data = detailQueries[idx]?.data;
      if (data) map.set(id, data);
    });
    return map;
  }, [detailSessionIds, detailQueries]);

  const editingDetail = editingSessionId ? detailById.get(editingSessionId) || null : null;

  const createSession = useCreateSession(clientId);
  const updateSession = useUpdateSession(clientId);
  const deleteSession = useDeleteSession(clientId);
  const isSubmitting = createSession.isPending || updateSession.isPending || deleteSession.isPending;

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  };

  const openCreate = () => {
    setEditingSessionId(null);
    setSessionFormOpen(true);
  };

  const openEdit = (sessionId: string) => {
    setEditingSessionId(sessionId);
    setSessionFormOpen(true);
  };

  const openDelete = (sessionId: string) => {
    setDeletingSessionId(sessionId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingSessionId) return;
    await deleteSession.mutateAsync({ sessionId: deletingSessionId });
    setDeleteConfirmOpen(false);
    setDeletingSessionId(null);
  };

  const submitCreate = async (data: SessionFormData) => {
    const request: SessionCreateRequest = {
      sessionNumber: data.sessionNumber,
      sessionDate: data.sessionDate,
      therapy: toTherapyEnum(data.therapy),
      longTermObjective: data.longTermObjective || undefined,
      shortTermObjective: data.shortTermObjective || undefined,
      zone: toZoneEnum(data.zone),
      sessionTags: data.sessionTags,
      successes: data.successes,
      struggles: data.struggles,
      interventionsUsed: data.interventionsUsed,
      strategiesUsed: data.strategiesUsed,
      reinforcementTypes: data.reinforcementTypes,
      discussionStatus: data.discussionStatus,
      additionalNotes: data.additionalNotes,
    };

    const created = await createSession.mutateAsync({ requestBody: request, activities: data.sessionActivities });
    if (created.id) {
      // Auto-expand the new session so activities are visible immediately.
      setExpandedSessions((prev) => new Set(prev).add(created.id!));
    }
    setSessionFormOpen(false);
  };

  const submitUpdate = async (data: SessionFormData) => {
    if (!editingSessionId) return;

    const request: SessionUpdateRequest = {
      sessionNumber: data.sessionNumber,
      sessionDate: data.sessionDate,
      therapy: data.therapy === 'ABA' ? SessionUpdateRequestNs.therapy.ABA : data.therapy === 'Speech' ? SessionUpdateRequestNs.therapy.SPEECH : SessionUpdateRequestNs.therapy.OT,
      longTermObjective: data.longTermObjective || undefined,
      shortTermObjective: data.shortTermObjective || undefined,
      zone:
        data.zone === 'green'
          ? SessionUpdateRequestNs.zone.GREEN
          : data.zone === 'yellow'
          ? SessionUpdateRequestNs.zone.YELLOW
          : data.zone === 'orange'
          ? SessionUpdateRequestNs.zone.ORANGE
          : data.zone === 'red'
          ? SessionUpdateRequestNs.zone.RED
          : data.zone === 'blue'
          ? SessionUpdateRequestNs.zone.BLUE
          : undefined,
      sessionTags: data.sessionTags,
      successes: data.successes,
      struggles: data.struggles,
      interventionsUsed: data.interventionsUsed,
      strategiesUsed: data.strategiesUsed,
      reinforcementTypes: data.reinforcementTypes,
      discussionStatus: data.discussionStatus,
      additionalNotes: data.additionalNotes,
    };

    const existingIds =
      editingDetail?.sessionActivities?.map((a) => a.id).filter(Boolean) as string[] | undefined ||
      (editingApiSession?.sessionActivities?.map((a) => a.id).filter(Boolean) as string[] | undefined);

    await updateSession.mutateAsync({
      sessionId: editingSessionId,
      requestBody: request,
      activities: data.sessionActivities,
      existingActivityIds: existingIds,
    });
    setSessionFormOpen(false);
    setEditingSessionId(null);
  };

  const initialFormData: Partial<SessionFormData> | undefined =
    editingSession && (editingDetail || editingApiSession)
      ? {
          clientId,
          sessionNumber: editingSession.sessionNumber,
          sessionDate: editingSession.date.toISOString().split('T')[0],
          therapy: editingSession.therapyType === 'aba' ? 'ABA' : editingSession.therapyType === 'speech' ? 'Speech' : 'OT',
          longTermObjective: editingSession.longTermObjective,
          shortTermObjective: editingSession.shortTermObjective,
          zone: editingSession.zone,
          sessionTags: (editingDetail || editingApiSession)?.sessionTags || [],
          successes: editingSession.successes,
          struggles: editingSession.struggles,
          interventionsUsed: editingSession.interventions,
          strategiesUsed: editingSession.strategies,
          reinforcementTypes: editingSession.reinforcements,
          discussionStatus: editingSession.discussedWithParent ? ['discussed'] : [],
          additionalNotes: editingSession.notes,
          sessionActivities:
            (editingDetail || editingApiSession)?.sessionActivities?.map((a, idx) => ({
              sequenceOrder: a.sequenceOrder || idx + 1,
              activity: a.activity || '',
              antecedent: a.antecedent || '',
              behaviour: a.behaviour || '',
              consequences: a.consequences || '',
              promptType: a.promptType,
            })) || [],
        }
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{sessions.length} Sessions</h2>
        <Button onClick={openCreate} className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]" disabled={isSubmitting}>
          <Plus className="size-4" />
          New Session
        </Button>
      </div>

      {sessionsQuery.isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading sessions...</p>
          </CardContent>
        </Card>
      ) : sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No sessions logged yet</p>
            <Button variant="outline" className="gap-2" onClick={openCreate} disabled={isSubmitting}>
              <Plus className="size-4" />
              Log First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => {
            const detailed = session.id ? detailById.get(session.id) : undefined;
            const sessionForRender = detailed ? mapSessionResponseToSession(detailed) : session;
            const apiSession = detailed || apiSessions.find((s) => s.id === session.id);

            const therapistName = apiSession?.therapist?.fullName || 'Not assigned';
            const isExpanded = expandedSessions.has(session.id);
            const activitiesCount = sessionForRender.activities.length;
            const hasInterventions = sessionForRender.interventions.length > 0;
            const hasStrategies = sessionForRender.strategies.length > 0;
            const hasReinforcements = sessionForRender.reinforcements.length > 0;
            const hasTags = !!(apiSession?.sessionTags && apiSession.sessionTags.length > 0);

            return (
              <Card key={session.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">Session #{sessionForRender.sessionNumber}</CardTitle>
                        <TherapyBadge type={sessionForRender.therapyType} />
                        <ZoneBadge zone={sessionForRender.zone} />
                        {hasTags ? (
                          <Badge variant="outline" className="gap-1">
                            <Tag className="size-3" />
                            {apiSession?.sessionTags?.length} tags
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <span>{formatDateTime(sessionForRender.date)}</span>
                        <span>•</span>
                        <span>{therapistName}</span>
                      </div>
                      {sessionForRender.shortTermObjective ? (
                        <p className="text-sm font-medium text-slate-700">{sessionForRender.shortTermObjective}</p>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-3 border-b">
                    {activitiesCount > 0 ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="size-4 text-[#0B5B45]" />
                        <span className="text-slate-600">
                          {activitiesCount} {activitiesCount === 1 ? 'Activity' : 'Activities'}
                        </span>
                      </div>
                    ) : null}
                    {sessionForRender.successes.length > 0 ? (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-slate-600">
                          {sessionForRender.successes.length} {sessionForRender.successes.length === 1 ? 'Success' : 'Successes'}
                        </span>
                      </div>
                    ) : null}
                    {sessionForRender.struggles.length > 0 ? (
                      <div className="flex items-center gap-2 text-sm">
                        <XCircle className="size-4 text-orange-600" />
                        <span className="text-slate-600">
                          {sessionForRender.struggles.length} {sessionForRender.struggles.length === 1 ? 'Struggle' : 'Struggles'}
                        </span>
                      </div>
                    ) : null}
                    {hasInterventions ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Lightbulb className="size-4 text-blue-600" />
                        <span className="text-slate-600">
                          {sessionForRender.interventions.length}{' '}
                          {sessionForRender.interventions.length === 1 ? 'Intervention' : 'Interventions'}
                        </span>
                      </div>
                    ) : null}
                    {hasStrategies ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="size-4 text-purple-600" />
                        <span className="text-slate-600">
                          {sessionForRender.strategies.length} {sessionForRender.strategies.length === 1 ? 'Strategy' : 'Strategies'}
                        </span>
                      </div>
                    ) : null}
                    {hasReinforcements ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="size-4 text-pink-600" />
                        <span className="text-slate-600">
                          {sessionForRender.reinforcements.length}{' '}
                          {sessionForRender.reinforcements.length === 1 ? 'Reinforcement' : 'Reinforcements'}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare
                        className={`size-4 ${sessionForRender.discussedWithParent ? 'text-green-600' : 'text-slate-400'}`}
                      />
                      <span className={sessionForRender.discussedWithParent ? 'text-green-700' : 'text-slate-600'}>
                        {sessionForRender.discussedWithParent ? 'Discussed' : 'Not discussed'}
                      </span>
                    </div>
                  </div>

                  {activitiesCount > 0 ? (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Activities ({activitiesCount})</p>
                      <div className="space-y-2">
                        {sessionForRender.activities.slice(0, isExpanded ? undefined : 2).map((activity, idx) => (
                          <div key={idx} className="text-sm bg-slate-50 p-2 rounded">
                            <p className="font-medium">{activity.name}</p>
                            {activity.promptType ? <p className="text-xs text-slate-500 mt-1">Prompt: {activity.promptType}</p> : null}
                          </div>
                        ))}
                        {!isExpanded && activitiesCount > 2 ? <p className="text-xs text-slate-500 italic">+{activitiesCount - 2} more activities</p> : null}
                      </div>
                    </div>
                  ) : null}

                  {isExpanded ? (
                    <div className="space-y-4 pt-3 border-t">
                      {sessionForRender.longTermObjective ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Long-term Objective</p>
                          <p className="text-sm">{sessionForRender.longTermObjective}</p>
                        </div>
                      ) : null}

                      {sessionForRender.successes.length > 0 ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600" />
                            Successes ({sessionForRender.successes.length})
                          </p>
                          <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                            {sessionForRender.successes.map((success, idx) => (
                              <li key={idx} className="text-green-700">
                                {success}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {sessionForRender.struggles.length > 0 ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <XCircle className="size-4 text-orange-600" />
                            Struggles ({sessionForRender.struggles.length})
                          </p>
                          <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                            {sessionForRender.struggles.map((struggle, idx) => (
                              <li key={idx} className="text-orange-700">
                                {struggle}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {hasInterventions ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Lightbulb className="size-4 text-blue-600" />
                            Interventions Used ({sessionForRender.interventions.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sessionForRender.interventions.map((intervention, idx) => (
                              <Badge key={idx} variant="secondary">
                                {intervention}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {hasStrategies ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Target className="size-4 text-purple-600" />
                            Strategies Used ({sessionForRender.strategies.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sessionForRender.strategies.map((strategy, idx) => (
                              <Badge key={idx} variant="secondary">
                                {strategy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {hasReinforcements ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Heart className="size-4 text-pink-600" />
                            Reinforcement Types ({sessionForRender.reinforcements.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sessionForRender.reinforcements.map((reinforcement, idx) => (
                              <Badge key={idx} variant="secondary">
                                {reinforcement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {hasTags ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Tag className="size-4" />
                            Tags
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {apiSession?.sessionTags?.map((tag, idx) => (
                              <Badge key={idx} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {sessionForRender.notes ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Additional Notes</p>
                          <p className="text-sm bg-slate-50 p-3 rounded">{sessionForRender.notes}</p>
                        </div>
                      ) : null}

                      {sessionForRender.activities.length > 0 ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">All Activities</p>
                          <div className="space-y-3">
                            {sessionForRender.activities.map((activity, idx) => (
                              <div key={idx} className="bg-slate-50 p-3 rounded space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{activity.name}</p>
                                  {activity.promptType ? (
                                    <Badge variant="outline" className="text-xs">
                                      {activity.promptType}
                                    </Badge>
                                  ) : null}
                                </div>
                                {activity.antecedent ? (
                                  <div>
                                    <p className="text-xs text-slate-600">Antecedent:</p>
                                    <p className="text-sm">{activity.antecedent}</p>
                                  </div>
                                ) : null}
                                {activity.behavior ? (
                                  <div>
                                    <p className="text-xs text-slate-600">Behavior:</p>
                                    <p className="text-sm">{activity.behavior}</p>
                                  </div>
                                ) : null}
                                {activity.consequence ? (
                                  <div>
                                    <p className="text-xs text-slate-600">Consequence:</p>
                                    <p className="text-sm">{activity.consequence}</p>
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="flex gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleSession(session.id)} className="gap-2">
                      <ChevronDown className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      {isExpanded ? 'Show Less' : 'View Details'}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => openEdit(session.id)} disabled={isSubmitting}>
                      <Edit className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => openDelete(session.id)}
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
        open={sessionFormOpen}
        onOpenChange={(open) => {
          setSessionFormOpen(open);
          if (!open) setEditingSessionId(null);
        }}
        title={editingSession ? `Edit Session #${editingSession.sessionNumber}` : 'Log New Session'}
        description={editingSession ? 'Update session details' : 'Document a therapy session for this client'}
        maxWidth="3xl"
      >
        {editingSessionId && !editingDetail ? (
          <div className="py-12 text-center">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading session details…</p>
          </div>
        ) : (
          <SessionForm
            clientId={clientId}
            sessionNumber={editingSession ? editingSession.sessionNumber : getNextSessionNumber(sessionNumbers)}
            onSubmit={editingSession ? submitUpdate : submitCreate}
            onCancel={() => {
              setSessionFormOpen(false);
              setEditingSessionId(null);
            }}
            initialData={initialFormData}
          />
        )}
      </FormDialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setDeletingSessionId(null);
        }}
        title="Delete session?"
        description="This will remove the session from this client. This action cannot be undone."
        confirmLabel={deleteSession.isPending ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}


