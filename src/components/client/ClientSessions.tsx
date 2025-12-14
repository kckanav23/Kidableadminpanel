import React, { useState, useEffect } from 'react';
import { Session } from '../../types';
import type { SessionResponse } from '../../types/api';
import { SessionCreateRequest, SessionUpdateRequest } from '../../types/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TherapyBadge } from '../badges/TherapyBadge';
import { ZoneBadge } from '../badges/ZoneBadge';
import { Plus, ChevronDown, Edit, Loader2, Activity, Target, CheckCircle2, XCircle, Lightbulb, Heart, MessageSquare, Tag } from 'lucide-react';
import { formatDate, formatDateTime } from '../../lib/utils';
import { getApiClient } from '../../lib/api-client';
import { toast } from 'sonner';
import { FormDialog, SessionForm, SessionFormData } from '../forms';

interface ClientSessionsProps {
  clientId: string;
  sessions?: Session[]; // Optional for backward compatibility
}

// Helper function to map API SessionResponse to component Session interface
function mapSessionResponseToSession(apiSession: SessionResponse): Session {
  const therapyTypeMap: Record<string, 'aba' | 'speech' | 'ot'> = {
    'ABA': 'aba',
    'Speech': 'speech',
    'OT': 'ot',
  };
  const therapyType = therapyTypeMap[apiSession.therapy || 'ABA'] || 'aba';

  return {
    id: apiSession.id || '',
    clientId: apiSession.clientId || '',
    sessionNumber: apiSession.sessionNumber || 0,
    date: apiSession.sessionDate ? new Date(apiSession.sessionDate) : new Date(),
    therapyType,
    zone: (apiSession.zone?.toLowerCase() as 'green' | 'yellow' | 'orange' | 'red' | 'blue') || 'green',
    therapistId: apiSession.therapist?.id || '',
    longTermObjective: apiSession.longTermObjective || '',
    shortTermObjective: apiSession.shortTermObjective || '',
    activities: apiSession.sessionActivities?.map(activity => {
      // Map invalid prompt types to valid ones or display as-is
      let promptType = activity.promptType;
      if (promptType) {
        const lowerPrompt = promptType.toLowerCase();
        // Map old/invalid values to valid ones
        if (lowerPrompt === 'visual' || lowerPrompt === 'modeling') {
          // Keep original for display but note it's invalid
          promptType = promptType; // Keep original, will display with warning
        }
      }
      return {
        id: activity.id || '',
        name: activity.activity || '',
        antecedent: activity.antecedent || '',
        behavior: activity.behaviour || '',
        consequence: activity.consequences || '',
        promptType: promptType,
      };
    }) || [],
    successes: apiSession.successes || [],
    struggles: apiSession.struggles || [],
    interventions: apiSession.interventionsUsed || [],
    strategies: apiSession.strategiesUsed || [],
    reinforcements: apiSession.reinforcementTypes || [],
    notes: apiSession.additionalNotes,
    discussedWithParent: apiSession.discussionStatus?.includes('discussed') || false,
  };
}

// Helper to normalize prompt type to valid API enum value
function normalizePromptType(promptType?: string): string | undefined {
  if (!promptType) return undefined;
  const lower = promptType.toLowerCase();
  // Map invalid/old values to valid enum values
  const mapping: Record<string, string> = {
    'visual': 'textual', // Map old "visual" to "textual"
    'modeling': 'verbal', // Map old "modeling" to "verbal"
    'full physical': 'full_physical',
    'partial physical': 'partial_physical',
  };
  return mapping[lower] || promptType; // Return original if already valid
}

// Helper to map Session to SessionFormData for editing
function mapSessionToFormData(session: Session, apiSession?: SessionResponse): SessionFormData {
  const therapyMap: Record<'aba' | 'speech' | 'ot', 'ABA' | 'Speech' | 'OT'> = {
    'aba': 'ABA',
    'speech': 'Speech',
    'ot': 'OT',
  };

  return {
    clientId: session.clientId,
    sessionNumber: session.sessionNumber,
    sessionDate: session.date.toISOString().split('T')[0],
    therapy: therapyMap[session.therapyType] || 'ABA',
    longTermObjective: session.longTermObjective,
    shortTermObjective: session.shortTermObjective,
    zone: session.zone,
    sessionTags: apiSession?.sessionTags || [],
    successes: session.successes,
    struggles: session.struggles,
    interventionsUsed: session.interventions,
    strategiesUsed: session.strategies,
    reinforcementTypes: session.reinforcements,
    discussionStatus: session.discussedWithParent ? ['discussed'] : [],
    additionalNotes: session.notes,
    sessionActivities: session.activities.map((act, idx) => ({
      sequenceOrder: idx + 1,
      activity: act.name,
      antecedent: act.antecedent,
      behaviour: act.behavior,
      consequences: act.consequence,
      promptType: normalizePromptType(act.promptType), // Normalize invalid values
    })),
  };
}

export function ClientSessions({ clientId, sessions: initialSessions }: ClientSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions || []);
  const [apiSessions, setApiSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(!initialSessions);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [sessionFormOpen, setSessionFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminSessions.getSessions({
          clientId,
          limit: 100,
        });
        setApiSessions(response);
        const mappedSessions = response.map(mapSessionResponseToSession);
        setSessions(mappedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load sessions');
        setSessions([]);
        setApiSessions([]);
      } finally {
        setLoading(false);
      }
    };

    if (!initialSessions) {
      fetchSessions();
    }
  }, [clientId, initialSessions]);

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  // Calculate next session number
  const getNextSessionNumber = () => {
    if (sessions.length === 0) return 1;
    const maxSessionNumber = Math.max(...sessions.map(s => s.sessionNumber));
    return maxSessionNumber + 1;
  };

  const handleCreateSession = async (data: SessionFormData) => {
    try {
      const api = getApiClient();
      
      // Map therapy string to enum
      const therapyMap: Record<string, SessionCreateRequest.therapy> = {
        'ABA': SessionCreateRequest.therapy.ABA,
        'Speech': SessionCreateRequest.therapy.SPEECH,
        'OT': SessionCreateRequest.therapy.OT,
      };
      
      // Map zone string to enum
      const zoneMap: Record<string, SessionCreateRequest.zone> = {
        'green': SessionCreateRequest.zone.GREEN,
        'yellow': SessionCreateRequest.zone.YELLOW,
        'orange': SessionCreateRequest.zone.ORANGE,
        'red': SessionCreateRequest.zone.RED,
        'blue': SessionCreateRequest.zone.BLUE,
      };
      
      const request: SessionCreateRequest = {
        sessionNumber: data.sessionNumber,
        sessionDate: data.sessionDate,
        therapy: therapyMap[data.therapy] || SessionCreateRequest.therapy.ABA,
        longTermObjective: data.longTermObjective,
        shortTermObjective: data.shortTermObjective,
        zone: data.zone ? zoneMap[data.zone] : undefined,
        sessionTags: data.sessionTags,
        successes: data.successes,
        struggles: data.struggles,
        interventionsUsed: data.interventionsUsed,
        strategiesUsed: data.strategiesUsed,
        reinforcementTypes: data.reinforcementTypes,
        discussionStatus: data.discussionStatus,
        additionalNotes: data.additionalNotes,
      };

      await api.adminSessions.createSession({
        clientId,
        requestBody: request,
      });

      // Refresh sessions list
      const updated = await api.adminSessions.getSessions({
        clientId,
        limit: 100,
      });
      setApiSessions(updated);
      const mappedSessions = updated.map(mapSessionResponseToSession);
      setSessions(mappedSessions);

      toast.success('Session created successfully');
      setSessionFormOpen(false);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    }
  };

  const handleUpdateSession = async (data: SessionFormData) => {
    if (!editingSession?.id) return;

    try {
      const api = getApiClient();
      
      // Map therapy string to enum
      const therapyMap: Record<string, SessionUpdateRequest.therapy> = {
        'ABA': SessionUpdateRequest.therapy.ABA,
        'Speech': SessionUpdateRequest.therapy.SPEECH,
        'OT': SessionUpdateRequest.therapy.OT,
      };
      
      // Map zone string to enum
      const zoneMap: Record<string, SessionUpdateRequest.zone> = {
        'green': SessionUpdateRequest.zone.GREEN,
        'yellow': SessionUpdateRequest.zone.YELLOW,
        'orange': SessionUpdateRequest.zone.ORANGE,
        'red': SessionUpdateRequest.zone.RED,
        'blue': SessionUpdateRequest.zone.BLUE,
      };
      
      const request: SessionUpdateRequest = {
        sessionNumber: data.sessionNumber,
        sessionDate: data.sessionDate,
        therapy: therapyMap[data.therapy] || SessionUpdateRequest.therapy.ABA,
        longTermObjective: data.longTermObjective,
        shortTermObjective: data.shortTermObjective,
        zone: data.zone ? zoneMap[data.zone] : undefined,
        sessionTags: data.sessionTags,
        successes: data.successes,
        struggles: data.struggles,
        interventionsUsed: data.interventionsUsed,
        strategiesUsed: data.strategiesUsed,
        reinforcementTypes: data.reinforcementTypes,
        discussionStatus: data.discussionStatus,
        additionalNotes: data.additionalNotes,
      };

      await api.adminSessions.updateSession({
        clientId,
        sessionId: editingSession.id,
        requestBody: request,
      });

      // Refresh sessions list
      const updated = await api.adminSessions.getSessions({
        clientId,
        limit: 100,
      });
      setApiSessions(updated);
      const mappedSessions = updated.map(mapSessionResponseToSession);
      setSessions(mappedSessions);

      toast.success('Session updated successfully');
      setSessionFormOpen(false);
      setEditingSession(null);
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{sessions.length} Sessions</h2>
        <Button 
          onClick={() => setSessionFormOpen(true)}
          className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]"
        >
          <Plus className="size-4" />
          New Session
        </Button>
      </div>

      {/* Sessions List */}
      {loading ? (
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
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setSessionFormOpen(true)}
            >
              <Plus className="size-4" />
              Log First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session, idx) => {
            const apiSession = apiSessions.find(s => s.id === session.id);
            const therapistName = apiSession?.therapist?.fullName || 'Not assigned';
            const isExpanded = expandedSessions.has(session.id);
            const activitiesCount = session.activities.length;
            const hasInterventions = session.interventions.length > 0;
            const hasStrategies = session.strategies.length > 0;
            const hasReinforcements = session.reinforcements.length > 0;
            const hasTags = apiSession?.sessionTags && apiSession.sessionTags.length > 0;

            return (
              <Card key={session.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">Session #{session.sessionNumber}</CardTitle>
                        <TherapyBadge type={session.therapyType} />
                        <ZoneBadge zone={session.zone} />
                        {hasTags && (
                          <Badge variant="outline" className="gap-1">
                            <Tag className="size-3" />
                            {apiSession?.sessionTags?.length} tags
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <span>{formatDateTime(session.date)}</span>
                        <span>•</span>
                        <span>{therapistName}</span>
                      </div>
                      {session.shortTermObjective && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-700">{session.shortTermObjective}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-3 border-b">
                    {activitiesCount > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="size-4 text-[#0B5B45]" />
                        <span className="text-slate-600">{activitiesCount} {activitiesCount === 1 ? 'Activity' : 'Activities'}</span>
                      </div>
                    )}
                    {session.successes.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-slate-600">{session.successes.length} {session.successes.length === 1 ? 'Success' : 'Successes'}</span>
                      </div>
                    )}
                    {session.struggles.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <XCircle className="size-4 text-orange-600" />
                        <span className="text-slate-600">{session.struggles.length} {session.struggles.length === 1 ? 'Struggle' : 'Struggles'}</span>
                      </div>
                    )}
                    {hasInterventions && (
                      <div className="flex items-center gap-2 text-sm">
                        <Lightbulb className="size-4 text-blue-600" />
                        <span className="text-slate-600">{session.interventions.length} {session.interventions.length === 1 ? 'Intervention' : 'Interventions'}</span>
                      </div>
                    )}
                    {hasStrategies && (
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="size-4 text-purple-600" />
                        <span className="text-slate-600">{session.strategies.length} {session.strategies.length === 1 ? 'Strategy' : 'Strategies'}</span>
                      </div>
                    )}
                    {hasReinforcements && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="size-4 text-pink-600" />
                        <span className="text-slate-600">{session.reinforcements.length} {session.reinforcements.length === 1 ? 'Reinforcement' : 'Reinforcements'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className={`size-4 ${session.discussedWithParent ? 'text-green-600' : 'text-slate-400'}`} />
                      <span className={session.discussedWithParent ? 'text-green-700' : 'text-slate-600'}>
                        {session.discussedWithParent ? 'Discussed' : 'Not discussed'}
                      </span>
                    </div>
                  </div>

                  {/* Activities Preview */}
                  {activitiesCount > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Activities ({activitiesCount})</p>
                      <div className="space-y-2">
                        {session.activities.slice(0, isExpanded ? undefined : 2).map((activity, idx) => (
                          <div key={idx} className="text-sm bg-slate-50 p-2 rounded">
                            <p className="font-medium">{activity.name}</p>
                            {activity.promptType && (
                              <p className="text-xs text-slate-500 mt-1">Prompt: {activity.promptType}</p>
                            )}
                          </div>
                        ))}
                        {!isExpanded && activitiesCount > 2 && (
                          <p className="text-xs text-slate-500 italic">+{activitiesCount - 2} more activities</p>
                        )}
                      </div>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="space-y-4 pt-3 border-t">
                      {session.longTermObjective && (
                      <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Long-term Objective</p>
                        <p className="text-sm">{session.longTermObjective}</p>
                      </div>
                      )}

                      {session.successes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600" />
                            Successes ({session.successes.length})
                          </p>
                          <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                            {session.successes.map((success, idx) => (
                              <li key={idx} className="text-green-700">{success}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {session.struggles.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <XCircle className="size-4 text-orange-600" />
                            Struggles ({session.struggles.length})
                          </p>
                          <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                            {session.struggles.map((struggle, idx) => (
                              <li key={idx} className="text-orange-700">{struggle}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {hasInterventions && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Lightbulb className="size-4 text-blue-600" />
                            Interventions Used ({session.interventions.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {session.interventions.map((intervention, idx) => (
                              <Badge key={idx} variant="secondary">{intervention}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {hasStrategies && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Target className="size-4 text-purple-600" />
                            Strategies Used ({session.strategies.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {session.strategies.map((strategy, idx) => (
                              <Badge key={idx} variant="secondary">{strategy}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {hasReinforcements && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Heart className="size-4 text-pink-600" />
                            Reinforcement Types ({session.reinforcements.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {session.reinforcements.map((reinforcement, idx) => (
                              <Badge key={idx} variant="secondary">{reinforcement}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {hasTags && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Tag className="size-4" />
                            Tags
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {apiSession?.sessionTags?.map((tag, idx) => (
                              <Badge key={idx} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {session.notes && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Additional Notes</p>
                          <p className="text-sm bg-slate-50 p-3 rounded">{session.notes}</p>
                        </div>
                      )}

                      {session.activities.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">All Activities</p>
                          <div className="space-y-3">
                            {session.activities.map((activity, idx) => (
                              <div key={idx} className="bg-slate-50 p-3 rounded space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{activity.name}</p>
                                  {activity.promptType && (
                                    <Badge variant="outline" className="text-xs">{activity.promptType}</Badge>
                                  )}
                                </div>
                                {activity.antecedent && (
                                  <div>
                                    <p className="text-xs text-slate-600">Antecedent:</p>
                                    <p className="text-sm">{activity.antecedent}</p>
                                  </div>
                                )}
                                {activity.behavior && (
                                  <div>
                                    <p className="text-xs text-slate-600">Behavior:</p>
                                    <p className="text-sm">{activity.behavior}</p>
                                  </div>
                                )}
                                {activity.consequence && (
                                  <div>
                                    <p className="text-xs text-slate-600">Consequence:</p>
                                    <p className="text-sm">{activity.consequence}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                      </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSession(session.id)}
                      className="gap-2"
                    >
                      <ChevronDown className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      {isExpanded ? 'Show Less' : 'View Details'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => {
                        setEditingSession(session);
                        setSessionFormOpen(true);
                      }}
                    >
                      <Edit className="size-4" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Session Form Dialog */}
      <FormDialog
        open={sessionFormOpen}
        onOpenChange={(open) => {
          setSessionFormOpen(open);
          if (!open) {
            setEditingSession(null);
          }
        }}
        title={editingSession ? `Edit Session #${editingSession.sessionNumber}` : 'Log New Session'}
        description={editingSession ? 'Update session details' : 'Document a therapy session for this client'}
        maxWidth="3xl"
      >
        <SessionForm
          clientId={clientId}
          sessionNumber={editingSession ? editingSession.sessionNumber : getNextSessionNumber()}
          onSubmit={editingSession ? handleUpdateSession : handleCreateSession}
          onCancel={() => {
            setSessionFormOpen(false);
            setEditingSession(null);
          }}
          initialData={editingSession ? mapSessionToFormData(editingSession, apiSessions.find(s => s.id === editingSession.id)) : undefined}
        />
      </FormDialog>
    </div>
  );
}