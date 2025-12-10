import { Session } from '../../types';
import { users } from '../../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TherapyBadge } from '../TherapyBadge';
import { ZoneBadge } from '../ZoneBadge';
import { Plus, ChevronDown, Edit } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useState } from 'react';

interface ClientSessionsProps {
  clientId: string;
  sessions: Session[];
}

export function ClientSessions({ clientId, sessions }: ClientSessionsProps) {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{sessions.length} Sessions</h2>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          New Session
        </Button>
      </div>

      {/* Sessions List */}
      {sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No sessions logged yet</p>
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Log First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map(session => {
            const therapist = users.find(u => u.id === session.therapistId);
            const isExpanded = expandedSessions.has(session.id);

            return (
              <Card key={session.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">Session #{session.sessionNumber}</CardTitle>
                        <TherapyBadge type={session.therapyType} />
                        <ZoneBadge zone={session.zone} />
                      </div>
                      <p className="text-sm text-slate-600">
                        {formatDate(session.date)} • {therapist?.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Objective</p>
                    <p className="text-sm">{session.shortTermObjective}</p>
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Long-term Objective</p>
                        <p className="text-sm">{session.longTermObjective}</p>
                      </div>

                      {session.successes.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">✓ Successes</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {session.successes.map((success, idx) => (
                              <li key={idx}>{success}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {session.struggles.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">✗ Struggles</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {session.struggles.map((struggle, idx) => (
                              <li key={idx}>{struggle}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {session.notes && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Notes</p>
                          <p className="text-sm">{session.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <span className={session.discussedWithParent ? 'text-green-700' : 'text-slate-600'}>
                          {session.discussedWithParent ? '✓ Discussed with parent' : '○ Yet to discuss with parent'}
                        </span>
                      </div>
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
                    <Button variant="ghost" size="sm" className="gap-2">
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
    </div>
  );
}