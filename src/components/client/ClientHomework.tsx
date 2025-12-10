import { Homework } from '../../types';
import { users, goals } from '../../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TherapyBadge } from '../TherapyBadge';
import { Plus, Calendar, Target, User, Edit, Eye } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ClientHomeworkProps {
  clientId: string;
  homework: Homework[];
}

const statusColors = {
  'worked': 'text-green-700 border-green-700',
  'not-worked': 'text-red-700 border-red-700',
  'yet-to-try': 'text-yellow-700 border-yellow-700',
  'not-started': 'text-slate-600 border-slate-300',
};

const statusLabels = {
  'worked': 'Worked',
  'not-worked': 'Not Worked',
  'yet-to-try': 'Yet to Try',
  'not-started': 'Not Started',
};

export function ClientHomework({ clientId, homework }: ClientHomeworkProps) {
  const [filter, setFilter] = useState<string>('active');

  const activeHomework = homework.filter(h => h.status !== 'not-worked');
  const displayHomework = filter === 'active' ? activeHomework : homework;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          Assign Homework
        </Button>
      </div>

      {/* Homework List */}
      {displayHomework.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No homework assigned yet</p>
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Assign First Homework
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayHomework.map(hw => {
            const assignedBy = users.find(u => u.id === hw.assignedById);
            const relatedGoal = hw.goalId ? goals.find(g => g.id === hw.goalId) : null;

            return (
              <Card key={hw.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TherapyBadge type={hw.therapyType} showLabel={false} />
                        <CardTitle className="text-lg">{hw.title}</CardTitle>
                      </div>
                      <p className="text-sm text-slate-600">{hw.description}</p>
                    </div>
                    <Badge variant="outline" className={statusColors[hw.status]}>
                      {statusLabels[hw.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    <span className="text-slate-600">Purpose: </span>
                    {hw.purpose}
                  </p>

                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-slate-400" />
                      <span className="text-slate-600">Assigned:</span>
                      <span>{formatDate(hw.assignedDate)}</span>
                    </div>
                    {hw.goalId && relatedGoal && (
                      <div className="flex items-center gap-2">
                        <Target className="size-4 text-slate-400" />
                        <span className="text-slate-600">Goal:</span>
                        <span className="truncate">{relatedGoal.title}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-slate-400" />
                      <span className="text-slate-600">Assigned by:</span>
                      <span>{assignedBy?.name}</span>
                    </div>
                  </div>

                  {hw.completionCount > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="text-slate-600">Completions: </span>
                        <span className="font-medium">{hw.completionCount} times logged</span>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="size-4" />
                      View Log
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="size-4" />
                      Log Completion
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