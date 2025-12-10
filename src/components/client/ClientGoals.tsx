import { useState } from 'react';
import { Goal } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TherapyBadge } from '../TherapyBadge';
import { Plus, TrendingUp, Edit } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ClientGoalsProps {
  clientId: string;
  goals: Goal[];
}

export function ClientGoals({ clientId, goals }: ClientGoalsProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  let filteredGoals = goals;
  if (statusFilter !== 'all') {
    filteredGoals = goals.filter(g => g.status === statusFilter);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="achieved">Achieved</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          Add Goal
        </Button>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No goals found</p>
            <Button variant="outline">Add First Goal</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map(goal => {
            const progress = ((goal.current - goal.baseline) / (goal.target - goal.baseline)) * 100;
            const progressClamped = Math.max(0, Math.min(100, progress));

            return (
              <Card key={goal.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TherapyBadge type={goal.therapyType} showLabel={false} />
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </div>
                      <p className="text-sm text-slate-600">{goal.description}</p>
                    </div>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="font-medium">{Math.round(progressClamped)}%</span>
                    </div>
                    <Progress value={progressClamped} className="h-2" />
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-slate-600">Baseline: </span>
                      <span className="font-medium">{goal.baseline}%</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Current: </span>
                      <span className="font-medium">{goal.current}%</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Target: </span>
                      <span className="font-medium">{goal.target}%</span>
                    </div>
                    {goal.dueDate && (
                      <div>
                        <span className="text-slate-600">Due: </span>
                        <span className="font-medium">{formatDate(goal.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <TrendingUp className="size-4" />
                      View Progress
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="size-4" />
                      Log Progress
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