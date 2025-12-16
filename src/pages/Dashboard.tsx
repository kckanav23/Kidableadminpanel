import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGreeting, formatDate, calculateAge } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ClientAvatar } from '../components/client/ClientAvatar';
import { TherapyBadge } from '../components/badges/TherapyBadge';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Plus, ArrowRight, Calendar, Clock, CheckCircle2, TrendingUp, Activity, Users, Loader2, Search } from 'lucide-react';
import { getApiClient, handleApiError } from '../lib/api-client';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import type { ClientSummaryResponse, SessionResponse, HomeworkResponse, GoalResponse, AuditLogResponse, TherapistResponse, ParentResponse } from '../types/api';
import { SessionCreateRequest, HomeworkCreateRequest } from '../types/api';
import {
  FormDialog,
  SessionForm,
  HomeworkForm,
  AddClientForm,
  type SessionFormData,
  type HomeworkFormData,
  type AddClientFormData,
} from '../components/forms';

export function Dashboard() {
  const { user } = useAuth();
  const today = new Date();
  const formattedDate = formatDate(today);
  
  // State for all data
  const [clients, setClients] = useState<ClientSummaryResponse[]>([]);
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [homework, setHomework] = useState<HomeworkResponse[]>([]);
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [homeworkDialogOpen, setHomeworkDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [dialogStep, setDialogStep] = useState<'select-client' | 'form'>('select-client');
  
  // Picklists for AddClientForm
  const [therapists, setTherapists] = useState<TherapistResponse[]>([]);
  const [parents, setParents] = useState<ParentResponse[]>([]);
  const [picklistsLoading, setPicklistsLoading] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  
  // Available goals for homework
  const [availableGoals, setAvailableGoals] = useState<Array<{ id: string; title: string }>>([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        
        // Fetch clients first
        const clientsData = await api.adminClients.listClients({ 
          size: 100, 
          mine: user?.role === 'THERAPIST' 
        });
        const clientsList = clientsData.items || [];
        setClients(clientsList);

        // Fetch audit logs (admin only)
        if (user?.admin) {
          try {
            const auditLogsData = await api.adminAuditLog.list7({ size: 5 });
            setAuditLogs(auditLogsData.items || []);
          } catch (error) {
            console.error('Error fetching audit logs:', error);
          }
        }

        // Fetch sessions, homework, and goals for clients (limited to first 10 for performance)
        if (clientsList.length > 0) {
          const clientIds = clientsList.slice(0, 10).map(c => c.id).filter(Boolean) as string[];
          
          const [allSessions, allHomework, allGoals] = await Promise.all([
            // Fetch sessions for each client
            Promise.all(
              clientIds.map(clientId =>
                api.adminSessions.getSessions({ clientId, limit: 5 }).catch(() => [])
              )
            ).then(results => results.flat()),
            
            // Fetch homework for each client
            Promise.all(
              clientIds.map(clientId =>
                api.adminHomework.getHomework({ clientId, active: true }).catch(() => [])
              )
            ).then(results => results.flat()),
            
            // Fetch goals for each client
            Promise.all(
              clientIds.map(clientId =>
                api.adminGoals.getGoals({ clientId, status: 'active' }).catch(() => [])
              )
            ).then(results => results.flat()),
          ]);

          setSessions(allSessions);
          setHomework(allHomework);
          setGoals(allGoals);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role]);

  // Get next session number for a client
  const getNextSessionNumber = (clientId: string) => {
    const clientSessions = sessions.filter(s => s.clientId === clientId);
    if (clientSessions.length === 0) return 1;
    const maxNum = Math.max(...clientSessions.map(s => s.sessionNumber || 0));
    return maxNum + 1;
  };

  // Open session dialog
  const openSessionDialog = () => {
    setSelectedClientId(null);
    setClientSearchQuery('');
    setDialogStep('select-client');
    setSessionDialogOpen(true);
  };

  // Open homework dialog
  const openHomeworkDialog = () => {
    setSelectedClientId(null);
    setClientSearchQuery('');
    setDialogStep('select-client');
    setAvailableGoals([]);
    setHomeworkDialogOpen(true);
  };

  // Open client dialog
  const openClientDialog = async () => {
    setClientDialogOpen(true);
    setPicklistsLoading(true);
    try {
      const api = getApiClient();
      const [therapistsData, parentsData] = await Promise.all([
        api.adminTherapists.list({ size: 100 }),
        api.adminParents.list6({ size: 100 }),
      ]);
      setTherapists(therapistsData.items || []);
      setParents(parentsData.items || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load therapists/parents');
    } finally {
      setPicklistsLoading(false);
    }
  };

  // Select client for session/homework
  const handleSelectClient = async (clientId: string) => {
    setSelectedClientId(clientId);
    setDialogStep('form');
    
    // Fetch goals for homework form if needed
    if (homeworkDialogOpen) {
      try {
        const api = getApiClient();
        const goalsData = await api.adminGoals.getGoals({
          clientId,
          status: 'active',
        });
        setAvailableGoals(goalsData.map(g => ({ id: g.id || '', title: g.title })));
      } catch (error) {
        console.error('Error fetching goals:', error);
        setAvailableGoals([]);
      }
    }
  };

  // Handle create session
  const handleCreateSession = async (data: SessionFormData) => {
    if (!selectedClientId) return;
    
    try {
      const api = getApiClient();
      const therapyMap: Record<string, SessionCreateRequest.therapy> = {
        'ABA': SessionCreateRequest.therapy.ABA,
        'Speech': SessionCreateRequest.therapy.SPEECH,
        'OT': SessionCreateRequest.therapy.OT,
      };
      const zoneMap: Record<string, SessionCreateRequest.zone> = {
        'green': SessionCreateRequest.zone.GREEN,
        'yellow': SessionCreateRequest.zone.YELLOW,
        'orange': SessionCreateRequest.zone.ORANGE,
        'red': SessionCreateRequest.zone.RED,
        'blue': SessionCreateRequest.zone.BLUE,
      };

      await api.adminSessions.createSession({
        clientId: selectedClientId,
        requestBody: {
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
        },
      });

      toast.success('Session created successfully');
      setSessionDialogOpen(false);
      setSelectedClientId(null);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    }
  };

  // Handle create homework
  const handleCreateHomework = async (data: HomeworkFormData) => {
    if (!selectedClientId) return;

    try {
      const api = getApiClient();
      const therapyMap: Record<string, HomeworkCreateRequest.therapy> = {
        'ABA': HomeworkCreateRequest.therapy.ABA,
        'Speech': HomeworkCreateRequest.therapy.SPEECH,
        'OT': HomeworkCreateRequest.therapy.OT,
      };

      await api.adminHomework.createHomework({
        clientId: selectedClientId,
        requestBody: {
          title: data.title,
          description: data.description,
          instructions: data.instructions ? [data.instructions] : [],
          therapy: therapyMap[data.therapy] || HomeworkCreateRequest.therapy.ABA,
          relatedGoalId: data.relatedGoalId,
          dataType: HomeworkCreateRequest.dataType.FREQUENCY,
          active: data.isActive,
          assignedDate: data.assignedDate,
          dueDate: data.dueDate,
        },
      });

      toast.success('Homework assigned successfully');
      setHomeworkDialogOpen(false);
      setSelectedClientId(null);
    } catch (error) {
      console.error('Error creating homework:', error);
      toast.error('Failed to assign homework');
    }
  };

  // Handle create client
  const handleCreateClient = async (data: AddClientFormData) => {
    if (isCreatingClient) return;
    setIsCreatingClient(true);
    try {
      if (!data.dateOfBirth || !data.therapyStartDate) {
        toast.error('Date of birth and therapy start date are required');
        return;
      }
      if (!data.therapyTypes || data.therapyTypes.length === 0) {
        toast.error('Please select at least one therapy type');
        return;
      }

      const api = getApiClient();
      const clientResponse = await api.adminClients.createClient({
        requestBody: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
          age: calculateAge(data.dateOfBirth),
          photoUrl: data.photoUrl || undefined,
          therapyStartDate: data.therapyStartDate.toISOString().split('T')[0],
          therapies: data.therapyTypes.map((t): 'ABA' | 'Speech' | 'OT' => {
            if (t === 'aba') return 'ABA';
            if (t === 'speech') return 'Speech';
            if (t === 'ot') return 'OT';
            return 'ABA';
          }),
          status: data.status as any,
          sensoryProfile:
            data.visual || data.auditory || data.tactile || data.vestibular || data.proprioceptive
              ? {
                  ...(data.visual && { visual: data.visual }),
                  ...(data.auditory && { auditory: data.auditory }),
                  ...(data.tactile && { tactile: data.tactile }),
                  ...(data.vestibular && { vestibular: data.vestibular }),
                  ...(data.proprioceptive && { proprioceptive: data.proprioceptive }),
                }
              : undefined,
          preferences: data.preferences
            ? data.preferences.split(',').map((p) => p.trim()).filter(Boolean)
            : undefined,
          dislikes: data.dislikes ? data.dislikes.split(',').map((d) => d.trim()).filter(Boolean) : undefined,
          notes: data.communicationStyles || undefined,
        },
      });

      const clientId = clientResponse.id;
      if (!clientId) throw new Error('Client ID not returned from API');

      // Assign therapist if selected
      if (data.therapistId) {
        try {
          await api.adminClientTherapists.assign({
            clientId,
            requestBody: { therapistId: data.therapistId, primary: true },
          });
        } catch (err) {
          console.error(err);
          toast.warning('Client created but therapist assignment failed');
        }
      }

      // Assign parent if selected
      if (data.parentAction !== 'skip') {
        try {
          if (data.parentAction === 'existing' && data.existingParentId) {
            await api.adminClientParents.create4({
              clientId,
              requestBody: {
                parentId: data.existingParentId,
                relationship: 'Parent',
                primary: data.isPrimaryParent,
              },
            });
          } else if (data.parentAction === 'new') {
            await api.adminClientParents.create4({
              clientId,
              requestBody: {
                fullName: data.newParentFullName,
                email: data.newParentEmail || undefined,
                phone: data.newParentPhone || undefined,
                relationship: data.newParentRelationship,
                primary: data.isPrimaryParent,
              },
            });
          }
        } catch (err) {
          console.error(err);
          toast.warning('Client created but parent assignment failed');
        }
      }

      toast.success('Client created successfully!');
      setClientDialogOpen(false);
      
      // Refresh clients list
      const api2 = getApiClient();
      const clientsData = await api2.adminClients.listClients({ 
        size: 100, 
        mine: user?.role === 'THERAPIST' 
      });
      setClients(clientsData.items || []);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to create client');
    } finally {
      setIsCreatingClient(false);
    }
  };

  // Filter clients for selection dialog
  const filteredClients = clients.filter(c => {
    if (!clientSearchQuery) return true;
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes(clientSearchQuery.toLowerCase());
  });

  // Filter clients based on user role
  const myClients = user?.role === 'THERAPIST'
    ? clients // API already filters with mine=true
    : clients;

  // Filter today's sessions
  const todaySessions = sessions.filter(s => {
    if (!s.sessionDate) return false;
    const sessionDate = new Date(s.sessionDate);
    return sessionDate.toDateString() === today.toDateString();
  });

  // Filter homework
  const pendingHomework = homework.filter(h => {
    const status = h.status?.toLowerCase();
    return status === 'yet_to_try' || status === 'not_started';
  });
  const completedHomework = homework.filter(h => h.status?.toLowerCase() === 'worked');

  // Recent sessions (last 5)
  const recentSessions = sessions
    .filter(s => s.sessionDate)
    .sort((a, b) => new Date(b.sessionDate!).getTime() - new Date(a.sessionDate!).getTime())
    .slice(0, 5);

  // Goals progress - calculate from latest progress entry
  const activeGoals = goals.filter(g => g.status === 'active');
  const avgProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => {
        // Calculate current value from latest progress entry
        const latestProgress = g.goalProgress && g.goalProgress.length > 0
          ? g.goalProgress[g.goalProgress.length - 1]
          : null;
        const current = latestProgress?.value ?? parseFloat(g.baselineValue || '0');
        const baseline = parseFloat(g.baselineValue || '0');
        const target = parseFloat(g.targetValue || '1');
        
        // Calculate percentage progress
        if (target === baseline) return 0;
        const progress = ((current - baseline) / (target - baseline)) * 100;
        return sum + Math.max(0, Math.min(100, progress));
      }, 0) / activeGoals.length)
    : 0;

  // Recent activity
  const recentActivity = auditLogs
    .filter(log => log.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5);

  // Get upcoming sessions (today's sessions)
  const upcomingSessions = todaySessions.slice(0, 3).map(session => {
    const client = clients.find(c => c.id === session.clientId);
    const sessionDate = session.sessionDate ? new Date(session.sessionDate) : today;
    const hours = sessionDate.getHours();
    const minutes = sessionDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const time = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    return {
      id: session.id || '',
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
      therapyType: (session.therapy?.toLowerCase() || 'aba') as 'aba' | 'speech' | 'ot',
      time,
      clientId: session.clientId || '',
    };
  });

  return (
    <div className="space-y-6">
      {/* Greeting & Quick Actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl mb-1">
            {getGreeting()}, {user?.fullName?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-slate-600">{formattedDate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]" onClick={openSessionDialog}>
            <Plus className="size-4" />
            New Session
          </Button>
          <Button variant="outline" className="gap-2" onClick={openClientDialog}>
            <Plus className="size-4" />
            New Client
          </Button>
          <Button variant="outline" className="gap-2" onClick={openHomeworkDialog}>
            <Plus className="size-4" />
            Assign Homework
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[#0B5B45]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-600">
                {user?.role === 'THERAPIST' ? 'My Clients' : 'Total Clients'}
              </CardTitle>
              <Users className="size-4 text-[#0B5B45]" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl mb-1">{myClients.length}</p>
            <p className="text-xs text-slate-500">Active caseload</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#5B9FED]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-600">Sessions Today</CardTitle>
              <Calendar className="size-4 text-[#5B9FED]" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl mb-1">{todaySessions.length}</p>
            <p className="text-xs text-slate-500">{upcomingSessions.length} upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#F4D16B]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-600">Homework</CardTitle>
              <CheckCircle2 className="size-4 text-[#F4D16B]" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl mb-1">{completedHomework.length}</p>
            <p className="text-xs text-slate-500">{pendingHomework.length} pending</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#0B5B45]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-600">Avg Progress</CardTitle>
              <TrendingUp className="size-4 text-[#0B5B45]" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl mb-1">{avgProgress}%</p>
            <p className="text-xs text-slate-500">{activeGoals.length} active goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-[#0B5B45]" />
              TODAY&apos;S SCHEDULE
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map(session => {
                  const client = clients.find(c => c.id === session.clientId);
                  return (
                    <Link
                      key={session.id}
                      to={`/clients/${session.clientId}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#0B5B45]/10 text-[#0B5B45]">
                        {session.time.split(':')[0]}
                        <span className="text-xs">{session.time.includes('AM') ? 'AM' : 'PM'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{session.clientName}</p>
                        <p className="text-sm text-slate-600">{session.time}</p>
                      </div>
                      <TherapyBadge type={session.therapyType as any} />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="size-12 mx-auto mb-2 text-slate-300" />
                <p>No sessions scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-[#0B5B45]" />
              RECENT ACTIVITY
            </CardTitle>
            {user?.admin && (
              <Link to="/audit-logs">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="size-4" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => {
                  const createdAt = activity.createdAt ? new Date(activity.createdAt) : today;
                  const timeAgo = Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
                  const timeDisplay = timeAgo < 1 ? 'Just now' : timeAgo < 24 ? `${timeAgo}h ago` : `${Math.floor(timeAgo / 24)}d ago`;
                  
                  return (
                    <div key={activity.id} className={`flex items-start gap-3 pb-3 ${idx < recentActivity.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.performedBy || 'System'}</span>
                          {' '}
                          <span className="text-slate-600">{activity.action || 'performed an action'}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{timeDisplay}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.resourceType || 'Unknown'}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="size-12 mx-auto mb-2 text-slate-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Clients - Enhanced */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>
            {user?.role === 'THERAPIST' ? 'MY CLIENTS' : 'ALL CLIENTS'}
          </CardTitle>
          <Link to="/clients">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="size-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myClients.slice(0, 5).map(client => {
              const clientGoals = goals.filter(g => g.clientId === client.id && g.status === 'active');
              const avgClientProgress = clientGoals.length > 0
                ? Math.round(clientGoals.reduce((sum, g) => {
                    // Calculate current value from latest progress entry
                    const latestProgress = g.goalProgress && g.goalProgress.length > 0
                      ? g.goalProgress[g.goalProgress.length - 1]
                      : null;
                    const current = latestProgress?.value ?? parseFloat(g.baselineValue || '0');
                    const baseline = parseFloat(g.baselineValue || '0');
                    const target = parseFloat(g.targetValue || '1');
                    
                    // Calculate percentage progress
                    if (target === baseline) return sum;
                    const progress = ((current - baseline) / (target - baseline)) * 100;
                    return sum + Math.max(0, Math.min(100, progress));
                  }, 0) / clientGoals.length)
                : 0;
              const clientSessions = sessions.filter(s => s.clientId === client.id && s.sessionDate);
              const lastSession = clientSessions.sort((a, b) => 
                new Date(b.sessionDate!).getTime() - new Date(a.sessionDate!).getTime()
              )[0];
              const daysSinceSession = lastSession && lastSession.sessionDate
                ? Math.floor((today.getTime() - new Date(lastSession.sessionDate).getTime()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="block p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  <div className="flex items-start gap-4">
                    <ClientAvatar name={`${client.firstName} ${client.lastName}`} photoUrl={client.photoUrl} />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{client.firstName} {client.lastName}</p>
                          <p className="text-sm text-slate-600">{client.age} years old</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {client.therapies?.map((type, idx) => (
                            <span key={`${client.id}-${type}-${idx}`}>
                              <TherapyBadge type={(type.toLowerCase() as 'aba' | 'speech' | 'ot')} showLabel={false} />
                            </span>
                          )) || null}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">Progress</span>
                            <span className="text-xs font-medium text-[#0B5B45]">{avgClientProgress}%</span>
                          </div>
                          <Progress value={avgClientProgress} className="h-2" />
                        </div>
                        <div className="text-xs text-slate-500">
                          {lastSession ? (
                            <span>Last session: {daysSinceSession === 0 ? 'Today' : `${daysSinceSession}d ago`}</span>
                          ) : (
                            <span>No sessions yet</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {clientGoals.length} active {clientGoals.length === 1 ? 'goal' : 'goals'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-400 flex-shrink-0 mt-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions & Homework Completions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>RECENT SESSIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session, idx) => {
                  const client = clients.find(c => c.id === session.clientId);
                  const sessionDate = session.sessionDate ? new Date(session.sessionDate) : today;
                  const daysAgo = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
                  const timeDisplay = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

                  return (
                    <Link
                      key={session.id}
                      to={`/clients/${session.clientId}`}
                      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors ${idx < recentSessions.length - 1 ? 'border-b' : ''}`}
                    >
                      <ClientAvatar
                        name={client ? `${client.firstName} ${client.lastName}` : 'Unknown'}
                        photoUrl={client?.photoUrl}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {client ? `${client.firstName} ${client.lastName}` : 'Unknown Client'}
                        </p>
                        <p className="text-xs text-slate-600">Session #{session.sessionNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TherapyBadge type={(session.therapy?.toLowerCase() || 'aba') as 'aba' | 'speech' | 'ot'} showLabel={false} />
                        {session.zone && (
                          <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                            {session.zone}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{timeDisplay}</span>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="size-12 mx-auto mb-2 text-slate-300" />
                  <p>No recent sessions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Homework Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>HOMEWORK ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {homework.length > 0 ? (
                homework.slice(0, 5).map((hw, idx) => {
                  const client = clients.find(c => c.id === hw.clientId);
                  const hwStatus = hw.status?.toLowerCase() || 'not-started';
                  const statusColors: Record<string, string> = {
                    'worked': 'bg-green-50 text-green-700 border-green-200',
                    'not_worked': 'bg-red-50 text-red-700 border-red-200',
                    'yet_to_try': 'bg-yellow-50 text-yellow-700 border-yellow-200',
                    'not_started': 'bg-slate-50 text-slate-700 border-slate-200',
                  };
                  const statusLabel = hwStatus.replace('_', ' ');

                return (
                  <div key={hw.id} className={`pb-4 ${idx < homework.slice(0, 5).length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-start gap-3">
                      <ClientAvatar
                        name={client ? `${client.firstName} ${client.lastName}` : 'Unknown'}
                        photoUrl={client?.photoUrl}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{hw.title}</p>
                        <p className="text-xs text-slate-600 mb-2">
                          {client ? `${client.firstName} ${client.lastName}` : 'Unknown Client'}
                        </p>
                        <div className="flex items-center gap-2">
                          <TherapyBadge type={(hw.therapy?.toLowerCase() || 'aba') as 'aba' | 'speech' | 'ot'} showLabel={false} />
                          <Badge variant="outline" className={`text-xs ${statusColors[hwStatus] || statusColors['not_started']}`}>
                            {statusLabel}
                          </Badge>
                          {hw.homeworkCompletions && hw.homeworkCompletions.length > 0 && (
                            <span className="text-xs text-slate-500">
                              Completed {hw.homeworkCompletions.length}x
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="size-12 mx-auto mb-2 text-slate-300" />
                <p>No homework activity</p>
              </div>
            )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Session Dialog */}
      <FormDialog
        open={sessionDialogOpen}
        onOpenChange={(open: boolean) => {
          setSessionDialogOpen(open);
          if (!open) {
            setSelectedClientId(null);
            setDialogStep('select-client');
          }
        }}
        title={dialogStep === 'select-client' ? 'Select Client' : 'Log New Session'}
        description={dialogStep === 'select-client' ? 'Choose a client for the new session' : 'Document a therapy session'}
        maxWidth={dialogStep === 'select-client' ? 'lg' : '3xl'}
        children={dialogStep === 'select-client' ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search clients..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredClients.length === 0 ? (
                <p className="text-center py-8 text-slate-500">No clients found</p>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors text-left"
                    onClick={() => handleSelectClient(client.id!)}
                  >
                    <ClientAvatar name={`${client.firstName} ${client.lastName}`} photoUrl={client.photoUrl} size="sm" />
                    <div className="flex-1">
                      <p className="font-medium">{client.firstName} {client.lastName}</p>
                      <p className="text-sm text-slate-600">{client.age} years old</p>
                    </div>
                    <div className="flex gap-1">
                      {client.therapies?.map((t, idx) => (
                        <span key={`${client.id}-${t}-${idx}`}>
                          <TherapyBadge type={t.toLowerCase() as 'aba' | 'speech' | 'ot'} showLabel={false} />
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : selectedClientId ? (
          <SessionForm
            clientId={selectedClientId}
            sessionNumber={getNextSessionNumber(selectedClientId)}
            onSubmit={handleCreateSession}
            onCancel={() => {
              setSessionDialogOpen(false);
              setSelectedClientId(null);
              setDialogStep('select-client');
            }}
          />
        ) : null}
      />

      {/* Assign Homework Dialog */}
      <FormDialog
        open={homeworkDialogOpen}
        onOpenChange={(open: boolean) => {
          setHomeworkDialogOpen(open);
          if (!open) {
            setSelectedClientId(null);
            setDialogStep('select-client');
          }
        }}
        title={dialogStep === 'select-client' ? 'Select Client' : 'Assign Homework'}
        description={dialogStep === 'select-client' ? 'Choose a client for homework assignment' : 'Create a new homework assignment'}
        maxWidth={dialogStep === 'select-client' ? 'lg' : '2xl'}
        children={dialogStep === 'select-client' ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search clients..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredClients.length === 0 ? (
                <p className="text-center py-8 text-slate-500">No clients found</p>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors text-left"
                    onClick={() => handleSelectClient(client.id!)}
                  >
                    <ClientAvatar name={`${client.firstName} ${client.lastName}`} photoUrl={client.photoUrl} size="sm" />
                    <div className="flex-1">
                      <p className="font-medium">{client.firstName} {client.lastName}</p>
                      <p className="text-sm text-slate-600">{client.age} years old</p>
                    </div>
                    <div className="flex gap-1">
                      {client.therapies?.map((t, idx) => (
                        <span key={`${client.id}-${t}-${idx}`}>
                          <TherapyBadge type={t.toLowerCase() as 'aba' | 'speech' | 'ot'} showLabel={false} />
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : selectedClientId ? (
          <HomeworkForm
            clientId={selectedClientId}
            onSubmit={handleCreateHomework}
            onCancel={() => {
              setHomeworkDialogOpen(false);
              setSelectedClientId(null);
              setDialogStep('select-client');
            }}
            availableGoals={availableGoals}
          />
        ) : null}
      />

      {/* New Client Dialog */}
      <FormDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        title="Add Client"
        description="Multi-step onboarding"
        maxWidth="3xl"
        children={picklistsLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading therapists and parents…</p>
          </div>
        ) : (
          <AddClientForm
            therapists={therapists}
            parents={parents}
            isSubmitting={isCreatingClient}
            onCancel={() => setClientDialogOpen(false)}
            onSubmit={handleCreateClient}
          />
        )}
      />
    </div>
  );
}