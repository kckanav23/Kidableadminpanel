import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import { TherapyBadge } from '@/components/badges/TherapyBadge';
import { ZoneBadge } from '@/components/badges/ZoneBadge';
import { formatDateTime } from '@/lib/utils';

import { useSessions } from '@/features/sessions/hooks/useSessions';
import { mapSessionResponseToSession } from '@/features/clients/tabs/sessions/utils/sessionMappers';
import heroPurple from '@/assets/hero-section-purple.svg';
import heroYellow from '@/assets/hero-section-yellow.svg';

export function SessionsPage() {
  const { user } = useAuth();
  const isAdmin = user?.admin === true;
  const navigate = useNavigate();

  // Access control:
  // - Admins default to "all" and can toggle
  // - Non-admins are forced to "my"
  const [viewMode, setViewMode] = useState<'my' | 'all' | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages

  useEffect(() => {
    if (viewMode === null) {
      setViewMode(isAdmin ? 'all' : 'my');
    } else if (!isAdmin && viewMode !== 'my') {
      setViewMode('my');
    }
  }, [isAdmin, viewMode]);

  const effectiveViewMode: 'my' | 'all' = useMemo(() => (viewMode === null ? (isAdmin ? 'all' : 'my') : viewMode), [isAdmin, viewMode]);

  const sessionsQuery = useSessions({
    all: isAdmin ? effectiveViewMode === 'all' : false,
    page: currentPage,
    size: 20,
  });

  const apiSessions = sessionsQuery.data?.items || [];
  const totalPages = sessionsQuery.data?.totalPages || 1;
  const total = sessionsQuery.data?.total || 0;
  const loading = sessionsQuery.isLoading || sessionsQuery.isFetching;

  const sessions = useMemo(() => apiSessions.map(mapSessionResponseToSession), [apiSessions]);
  const sortedSessions = useMemo(() => [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [sessions]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewModeChange = (mode: 'my' | 'all') => {
    if (!isAdmin) return;
    setViewMode(mode);
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Sessions</h1>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <Button
              variant={effectiveViewMode === 'my' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('my')}
              disabled={loading}
            >
              My Sessions
            </Button>
            <Button
              variant={effectiveViewMode === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('all')}
              disabled={loading}
            >
              All Sessions
            </Button>
          </div>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{total} Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading sessions...</p>
            </div>
          ) : sortedSessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No sessions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedSessions.map((session) => {
                const apiSession = apiSessions.find((s) => s.id === session.id);
                const therapistName = apiSession?.therapist?.fullName || 'Not assigned';
                const hasTags = !!(apiSession?.sessionTags && apiSession.sessionTags.length > 0);
                const canNavigateToClient = Boolean(session.clientId);

                return (
                  <Card
                    key={session.id}
                    className={canNavigateToClient ? 'cursor-pointer hover:shadow-sm transition-shadow' : undefined}
                    onClick={() => {
                      if (!session.clientId) return;
                      navigate(`/clients/${session.clientId}?tab=sessions`);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <CardTitle className="text-lg">Session #{session.sessionNumber}</CardTitle>
                            <TherapyBadge type={session.therapyType} />
                            <ZoneBadge zone={session.zone} />
                            {hasTags ? (
                              <Badge variant="outline">{apiSession?.sessionTags?.length} tags</Badge>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600 flex-wrap">
                            <span>{formatDateTime(session.date)}</span>
                            <span>•</span>
                            <span>{therapistName}</span>
                            {session.clientId ? (
                              <>
                                <span>•</span>
                                <Link
                                  to={`/clients/${session.clientId}?tab=sessions`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[#0B5B45] hover:underline"
                                >
                                  View client
                                </Link>
                              </>
                            ) : null}
                          </div>
                          {session.shortTermObjective ? <p className="text-sm font-medium text-slate-700 mt-2">{session.shortTermObjective}</p> : null}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-3 border-b">
                        {session.activities.length > 0 ? (
                          <div className="text-sm text-slate-600">
                            {session.activities.length} {session.activities.length === 1 ? 'Activity' : 'Activities'}
                          </div>
                        ) : null}
                        {session.successes.length > 0 ? (
                          <div className="text-sm text-slate-600">
                            {session.successes.length} {session.successes.length === 1 ? 'Success' : 'Successes'}
                          </div>
                        ) : null}
                        {session.struggles.length > 0 ? (
                          <div className="text-sm text-slate-600">
                            {session.struggles.length} {session.struggles.length === 1 ? 'Struggle' : 'Struggles'}
                          </div>
                        ) : null}
                        <div className="text-sm text-slate-600">
                          {session.discussedWithParent ? 'Discussed' : 'Not discussed'}
                        </div>
                      </div>

                      {session.activities.length > 0 ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Activities ({session.activities.length})</p>
                          <div className="space-y-2">
                            {session.activities.slice(0, 2).map((activity, idx) => (
                              <div key={idx} className="text-sm bg-slate-50 p-2 rounded">
                                <p className="font-medium">{activity.name}</p>
                                {activity.promptType ? <p className="text-xs text-slate-500 mt-1">Prompt: {activity.promptType}</p> : null}
                              </div>
                            ))}
                            {session.activities.length > 2 ? (
                              <p className="text-xs text-slate-500 italic">+{session.activities.length - 2} more activities</p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>

        {totalPages > 1 && (
          <CardContent className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
              >
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </Button>
              <p className="text-sm text-slate-600">
                Page {currentPage + 1} of {totalPages} • {total} total sessions
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Next
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="bg-slate-50 border-slate-200 overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-slate-900 mb-1">Sessions page is under development</p>
              <p className="text-sm text-slate-700">
                You can already browse sessions and jump to the client’s Sessions tab. Next up: richer filters, faster search, and a smoother “view
                details” experience.
              </p>
              <p className="text-xs text-slate-500 mt-2">Thanks for being early — this page is getting fun upgrades soon.</p>
            </div>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              <img src={heroYellow} alt="Under development illustration" className="h-16 w-auto opacity-90" />
              <img src={heroPurple} alt="Under development illustration" className="h-16 w-auto opacity-90" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


