import { Calendar, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatsCards({
  isTherapist,
  clientsCount,
  sessionsTodayCount,
  upcomingSessionsCount,
  completedHomeworkCount,
  pendingHomeworkCount,
  avgProgressPercent,
  activeGoalsCount,
}: {
  isTherapist: boolean;
  clientsCount: number;
  sessionsTodayCount: number;
  upcomingSessionsCount: number;
  completedHomeworkCount: number;
  pendingHomeworkCount: number;
  avgProgressPercent: number;
  activeGoalsCount: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-[#0B5B45]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-slate-600">{isTherapist ? 'My Clients' : 'Total Clients'}</CardTitle>
            <Users className="size-4 text-[#0B5B45]" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl mb-1">{clientsCount}</p>
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
          <p className="text-3xl mb-1">{sessionsTodayCount}</p>
          <p className="text-xs text-slate-500">{upcomingSessionsCount} upcoming</p>
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
          <p className="text-3xl mb-1">{completedHomeworkCount}</p>
          <p className="text-xs text-slate-500">{pendingHomeworkCount} pending</p>
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
          <p className="text-3xl mb-1">{avgProgressPercent}%</p>
          <p className="text-xs text-slate-500">{activeGoalsCount} active goals</p>
        </CardContent>
      </Card>
    </div>
  );
}


