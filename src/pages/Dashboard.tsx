import { Link } from 'react-router-dom';
import { currentUser, clients, sessions, homework, goals, auditLogs, users } from '../lib/mockData';
import { getGreeting, formatDate } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ClientAvatar } from '../components/ClientAvatar';
import { TherapyBadge } from '../components/TherapyBadge';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Plus, ArrowRight, Calendar, Clock, CheckCircle2, TrendingUp, Activity, Users } from 'lucide-react';

export function Dashboard() {
  const today = new Date();
  const formattedDate = formatDate(today);
  
  const myClients = currentUser.role === 'therapist'
    ? clients.filter(c => c.primaryTherapistId === currentUser.id)
    : clients;

  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate.toDateString() === today.toDateString();
  });

  const pendingHomework = homework.filter(h => h.status === 'yet-to-try' || h.status === 'not-started');
  const completedHomework = homework.filter(h => h.status === 'worked');

  // Recent sessions (last 5)
  const recentSessions = sessions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  // Goals progress
  const activeGoals = goals.filter(g => g.status === 'active');
  const avgProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.current, 0) / activeGoals.length)
    : 0;

  // Recent activity
  const recentActivity = auditLogs
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  // Get upcoming sessions (mock data for today and next few days)
  const upcomingSessions = [
    { id: '1', clientName: 'Alex Johnson', therapyType: 'aba', time: '10:00 AM', clientId: 'c1' },
    { id: '2', clientName: 'Emma Wilson', therapyType: 'speech', time: '11:30 AM', clientId: 'c2' },
    { id: '3', clientName: 'Alex Johnson', therapyType: 'speech', time: '2:00 PM', clientId: 'c1' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting & Quick Actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl mb-1">
            {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-600">{formattedDate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
            <Plus className="size-4" />
            New Session
          </Button>
          <Button variant="outline" className="gap-2">
            <Plus className="size-4" />
            New Client
          </Button>
          <Button variant="outline" className="gap-2">
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
                {currentUser.role === 'therapist' ? 'My Clients' : 'Total Clients'}
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
            {currentUser.role === 'admin' && (
              <Link to="/audit-logs">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="size-4" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => {
                const timeAgo = Math.floor((today.getTime() - activity.timestamp.getTime()) / (1000 * 60 * 60));
                const timeDisplay = timeAgo < 1 ? 'Just now' : timeAgo < 24 ? `${timeAgo}h ago` : `${Math.floor(timeAgo / 24)}d ago`;
                
                return (
                  <div key={activity.id} className={`flex items-start gap-3 pb-3 ${idx < recentActivity.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.userName}</span>
                        {' '}
                        <span className="text-slate-600">{activity.details.toLowerCase()}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{timeDisplay}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.action}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Clients - Enhanced */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>
            {currentUser.role === 'therapist' ? 'MY CLIENTS' : 'ALL CLIENTS'}
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
                ? Math.round(clientGoals.reduce((sum, g) => sum + g.current, 0) / clientGoals.length)
                : 0;
              const clientSessions = sessions.filter(s => s.clientId === client.id);
              const lastSession = clientSessions.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
              const daysSinceSession = lastSession
                ? Math.floor((today.getTime() - lastSession.date.getTime()) / (1000 * 60 * 60 * 24))
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
                          {client.therapyTypes.map(type => (
                            <TherapyBadge key={type} type={type} showLabel={false} />
                          ))}
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
              {recentSessions.map((session, idx) => {
                const client = clients.find(c => c.id === session.clientId);
                const daysAgo = Math.floor((today.getTime() - session.date.getTime()) / (1000 * 60 * 60 * 24));
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
                      <TherapyBadge type={session.therapyType} showLabel={false} />
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                        {session.zone}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">{timeDisplay}</span>
                  </Link>
                );
              })}
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
              {homework.slice(0, 5).map((hw, idx) => {
                const client = clients.find(c => c.id === hw.clientId);
                const statusColors = {
                  'worked': 'bg-green-50 text-green-700 border-green-200',
                  'worked-with-help': 'bg-blue-50 text-blue-700 border-blue-200',
                  'yet-to-try': 'bg-yellow-50 text-yellow-700 border-yellow-200',
                  'not-started': 'bg-slate-50 text-slate-700 border-slate-200',
                  'too-hard': 'bg-red-50 text-red-700 border-red-200',
                };

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
                          <TherapyBadge type={hw.therapyType} showLabel={false} />
                          <Badge variant="outline" className={`text-xs ${statusColors[hw.status]}`}>
                            {hw.status.replace('-', ' ')}
                          </Badge>
                          {hw.completionCount && (
                            <span className="text-xs text-slate-500">
                              Completed {hw.completionCount}x
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}