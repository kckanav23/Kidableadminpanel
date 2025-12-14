import { HomeworkCompletion } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import type { HomeworkResponse } from '../../../types/api';

interface HomeworkCompletionHistoryProps {
  homework: HomeworkResponse;
  onClose: () => void;
}

const statusColors = {
  'worked': 'text-green-700 border-green-700 bg-green-50',
  'not_worked': 'text-red-700 border-red-700 bg-red-50',
  'yet_to_try': 'text-yellow-700 border-yellow-700 bg-yellow-50',
  'not_started': 'text-slate-600 border-slate-300 bg-slate-50',
};

const statusLabels = {
  'worked': 'Worked',
  'not_worked': 'Not Worked',
  'yet_to_try': 'Yet to Try',
  'not_started': 'Not Started',
};

export function HomeworkCompletionHistory({ homework, onClose }: HomeworkCompletionHistoryProps) {
  const completions = homework.homeworkCompletions || [];
  const sortedCompletions = [...completions].sort((a, b) => 
    new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
  );

  // Calculate statistics
  const totalCompletions = completions.length;
  const workedCount = completions.filter(c => c.status === 'worked').length;
  const notWorkedCount = completions.filter(c => c.status === 'not_worked').length;
  const yetToTryCount = completions.filter(c => c.status === 'yet_to_try').length;
  
  const totalFrequency = completions.reduce((sum, c) => sum + (c.frequencyCount || 0), 0);
  const totalDuration = completions.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);
  const avgFrequency = totalCompletions > 0 ? (totalFrequency / totalCompletions).toFixed(1) : '0';
  const avgDuration = totalCompletions > 0 ? Math.round(totalDuration / totalCompletions) : 0;

  return (
    <div className="space-y-6">
      {/* Homework Header */}
      <div>
        <h3 className="text-xl font-semibold mb-2">{homework.title}</h3>
        {homework.description && (
          <p className="text-slate-600 mb-3">{homework.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-slate-400" />
            <span className="text-slate-600">Assigned:</span>
            <span>{formatDate(new Date(homework.assignedDate))}</span>
          </div>
          {homework.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-slate-400" />
              <span className="text-slate-600">Due:</span>
              <span>{formatDate(new Date(homework.dueDate))}</span>
            </div>
          )}
        </div>
        {homework.frequencyTarget && (
          <div className="mt-2 text-sm">
            <span className="text-slate-600">Target Frequency: </span>
            <span className="font-medium">{homework.frequencyTarget}</span>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-slate-600 mb-1">Total Logs</div>
            <div className="text-2xl font-bold text-[#0B5B45]">{totalCompletions}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-xs text-slate-600 mb-1">Worked</div>
            <div className="text-2xl font-bold text-green-700">{workedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="text-xs text-slate-600 mb-1">Not Worked</div>
            <div className="text-2xl font-bold text-red-700">{notWorkedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-xs text-slate-600 mb-1">Yet to Try</div>
            <div className="text-2xl font-bold text-yellow-700">{yetToTryCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Average Statistics */}
      {(totalFrequency > 0 || totalDuration > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {totalFrequency > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="size-4 text-slate-400" />
                  <span className="text-xs text-slate-600">Avg Frequency</span>
                </div>
                <div className="text-xl font-bold">{avgFrequency}x</div>
              </CardContent>
            </Card>
          )}
          {totalDuration > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="size-4 text-slate-400" />
                  <span className="text-xs text-slate-600">Avg Duration</span>
                </div>
                <div className="text-xl font-bold">{avgDuration} min</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Completion History */}
      <div>
        <h4 className="font-medium mb-3">Completion History</h4>
        {sortedCompletions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600">No completion entries yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedCompletions.map((completion) => (
              <Card key={completion.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Calendar className="size-4 text-slate-400 mt-1" />
                      <div>
                        <div className="font-medium">
                          {formatDate(new Date(completion.completionDate))}
                        </div>
                        {completion.loggedByParent && (
                          <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                            <User className="size-3" />
                            <span>Logged by parent</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={statusColors[completion.status]}
                    >
                      {statusLabels[completion.status]}
                    </Badge>
                  </div>

                  {(completion.frequencyCount || completion.durationMinutes) && (
                    <div className="flex gap-4 text-sm mb-2 pl-7">
                      {completion.frequencyCount !== undefined && (
                        <div>
                          <span className="text-slate-600">Frequency: </span>
                          <span className="font-medium">{completion.frequencyCount}x</span>
                        </div>
                      )}
                      {completion.durationMinutes !== undefined && (
                        <div className="flex items-center gap-1">
                          <Clock className="size-3 text-slate-400" />
                          <span className="font-medium">{completion.durationMinutes} min</span>
                        </div>
                      )}
                    </div>
                  )}

                  {completion.notes && (
                    <div className="pl-7 mt-2">
                      <div className="text-xs text-slate-600 mb-1">Notes:</div>
                      <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
                        {completion.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Instructions Section */}
      {homework.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {homework.instructions.split('\n').filter(Boolean).map((instruction, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-slate-600">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Related Goal */}
      {homework.relatedGoal && (
        <Card className="bg-[#0B5B45]/5 border-[#0B5B45]/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="size-4" />
              Related Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium mb-1">{homework.relatedGoal.title}</div>
            <p className="text-sm text-slate-600">{homework.relatedGoal.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Close Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onClose} className="bg-[#0B5B45] hover:bg-[#0D6953]">
          Close
        </Button>
      </div>
    </div>
  );
}
