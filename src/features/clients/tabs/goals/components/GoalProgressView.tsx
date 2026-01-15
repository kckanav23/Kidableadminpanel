import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Flag } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import type { Goal } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TherapyBadge } from '@/components/badges/TherapyBadge';
import type { GoalProgressEntry } from '@/features/clients/tabs/goals/utils/goalMappers';

export function GoalProgressView({
  goal,
  progressEntries,
  onClose,
}: {
  goal: Goal;
  progressEntries?: GoalProgressEntry[];
  onClose: () => void;
}) {
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '60d' | '90d'>('all');

  const entries = progressEntries || [];

  const filteredEntries = entries.filter((entry) => {
    if (timeRange === 'all') return true;
    const daysAgo = parseInt(timeRange.replace('d', ''), 10);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    return entry.date >= cutoffDate;
  });

  const chartData = filteredEntries.map((entry) => ({
    date: formatDate(entry.date, 'MMM d'),
    value: entry.value,
    fullDate: formatDate(entry.date),
  }));

  const latestEntry = filteredEntries[filteredEntries.length - 1];
  const previousEntry = filteredEntries[filteredEntries.length - 2];
  const recentChange = latestEntry && previousEntry ? latestEntry.value - previousEntry.value : 0;
  const remainingToTarget = goal.target - goal.current;
  const progressPercent = ((goal.current - goal.baseline) / (goal.target - goal.baseline)) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TherapyBadge type={goal.therapyType} showLabel={false} />
          <h3 className="text-xl font-semibold">{goal.title}</h3>
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
        <p className="text-slate-600">{goal.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Flag className="size-4 text-slate-400" />
              <span className="text-xs text-slate-600">Current</span>
            </div>
            <div className="text-2xl font-bold text-[#0B5B45]">{goal.current}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Target className="size-4 text-slate-400" />
              <span className="text-xs text-slate-600">Target</span>
            </div>
            <div className="text-2xl font-bold">{goal.target}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              {recentChange > 0 ? (
                <TrendingUp className="size-4 text-green-600" />
              ) : recentChange < 0 ? (
                <TrendingDown className="size-4 text-red-600" />
              ) : (
                <Minus className="size-4 text-slate-400" />
              )}
              <span className="text-xs text-slate-600">Recent Change</span>
            </div>
            <div
              className={`text-2xl font-bold ${
                recentChange > 0 ? 'text-green-600' : recentChange < 0 ? 'text-red-600' : 'text-slate-600'
              }`}
            >
              {recentChange > 0 ? '+' : ''}
              {recentChange}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-4 text-slate-400" />
              <span className="text-xs text-slate-600">To Target</span>
            </div>
            <div className="text-2xl font-bold">{remainingToTarget}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="font-medium">Progress Over Time</h4>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="60d">Last 60 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number | string) => [`${value}%`, 'Progress']}
              />
              <ReferenceLine
                y={goal.baseline}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                label={{ value: 'Baseline', position: 'insideTopRight', fill: '#64748b' }}
              />
              <ReferenceLine
                y={goal.target}
                stroke="#0B5B45"
                strokeDasharray="3 3"
                label={{ value: 'Target', position: 'insideTopRight', fill: '#0B5B45' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0B5B45"
                strokeWidth={3}
                dot={{ fill: '#0B5B45', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div>
        <h4 className="font-medium mb-3">Progress History</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredEntries
            .slice()
            .reverse()
            .map((entry, index) => {
              const prev = filteredEntries[filteredEntries.length - index - 2];
              const change = prev ? entry.value - prev.value : 0;

              return (
                <Card key={entry.id}>
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="size-4 text-slate-400" />
                        <div>
                          <div className="font-medium">{formatDate(entry.date)}</div>
                          <div className="text-xs text-slate-600">Recorded by {entry.recordedBy}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {change !== 0 ? (
                          <div className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '+' : ''}
                            {change}%
                          </div>
                        ) : null}
                        <div className="text-xl font-bold text-[#0B5B45]">{entry.value}%</div>
                      </div>
                    </div>
                    {entry.notes ? <p className="text-sm text-slate-600 mt-2 pl-7">{entry.notes}</p> : null}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Goal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Baseline:</span>
            <span className="font-medium">{goal.baseline}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Target:</span>
            <span className="font-medium">{goal.target}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Current Progress:</span>
            <span className="font-medium text-[#0B5B45]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Started:</span>
            <span className="font-medium">{formatDate(goal.createdDate)}</span>
          </div>
          {goal.dueDate ? (
            <div className="flex justify-between">
              <span className="text-slate-600">Target Date:</span>
              <span className="font-medium">{formatDate(goal.dueDate)}</span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onClose} className="bg-[#0B5B45] hover:bg-[#0D6953]">
          Close
        </Button>
      </div>
    </div>
  );
}


