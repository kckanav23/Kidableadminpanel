import { useState } from 'react';
import { Goal } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { TherapyBadge } from '../../badges/TherapyBadge';
import { formatDate } from '../../../lib/utils';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface GoalProgressViewProps {
  goal: Goal;
  progressEntries?: ProgressEntry[];
  onClose: () => void;
}

interface ProgressEntry {
  id: string;
  goalId: string;
  date: Date;
  value: number;
  notes?: string;
  recordedBy: string;
}

// Mock data generator
function generateMockProgressData(goal: Goal): ProgressEntry[] {
  const entries: ProgressEntry[] = [];
  const startDate = new Date(goal.createdDate);
  const today = new Date();
  const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const numEntries = Math.min(Math.floor(daysDiff / 7), 12); // Weekly entries, max 12

  for (let i = 0; i <= numEntries; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7));
    
    // Simulate gradual progress from baseline to current
    const progress = goal.baseline + ((goal.current - goal.baseline) * (i / numEntries));
    
    entries.push({
      id: `entry-${i}`,
      goalId: goal.id,
      date,
      value: Math.round(progress),
      recordedBy: 'Sarah Johnson',
    });
  }

  return entries;
}

export function GoalProgressView({ goal, progressEntries, onClose }: GoalProgressViewProps) {
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '60d' | '90d'>('all');
  
  // Use mock data if no entries provided
  const entries = progressEntries || generateMockProgressData(goal);

  // Filter entries by time range
  const filteredEntries = entries.filter(entry => {
    if (timeRange === 'all') return true;
    const daysAgo = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    return entry.date >= cutoffDate;
  });

  // Prepare chart data
  const chartData = filteredEntries.map(entry => ({
    date: formatDate(entry.date, 'MMM d'),
    value: entry.value,
    fullDate: formatDate(entry.date),
  }));

  // Calculate statistics
  const latestEntry = filteredEntries[filteredEntries.length - 1];
  const previousEntry = filteredEntries[filteredEntries.length - 2];
  const recentChange = latestEntry && previousEntry ? latestEntry.value - previousEntry.value : 0;
  const totalChange = goal.current - goal.baseline;
  const remainingToTarget = goal.target - goal.current;
  const progressPercent = ((goal.current - goal.baseline) / (goal.target - goal.baseline)) * 100;

  return (
    <div className="space-y-6">
      {/* Goal Header */}
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

      {/* Statistics Cards */}
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
            <div className={`text-2xl font-bold ${
              recentChange > 0 ? 'text-green-600' : recentChange < 0 ? 'text-red-600' : 'text-slate-600'
            }`}>
              {recentChange > 0 ? '+' : ''}{recentChange}%
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

      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Progress Over Time</h4>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
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

      {/* Progress Chart */}
      <Card>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [`${value}%`, 'Progress']}
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

      {/* Progress History */}
      <div>
        <h4 className="font-medium mb-3">Progress History</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredEntries.slice().reverse().map((entry, index) => {
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
                      {change !== 0 && (
                        <div className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change > 0 ? '+' : ''}{change}%
                        </div>
                      )}
                      <div className="text-xl font-bold text-[#0B5B45]">{entry.value}%</div>
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-slate-600 mt-2 pl-7">{entry.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Goal Details */}
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
          {goal.dueDate && (
            <div className="flex justify-between">
              <span className="text-slate-600">Target Date:</span>
              <span className="font-medium">{formatDate(goal.dueDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Close Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onClose} className="bg-[#0B5B45] hover:bg-[#0D6953]">
          Close
        </Button>
      </div>
    </div>
  );
}
