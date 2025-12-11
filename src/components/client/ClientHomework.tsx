import { Homework } from '../../types';
import { users, goals } from '../../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TherapyBadge } from '../TherapyBadge';
import { Plus, Calendar, Target, User, Edit, Eye, Trash2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  FormDialog,
  HomeworkForm,
  HomeworkCompletionForm,
  DeleteConfirmDialog,
  HomeworkFormData,
  HomeworkCompletionData,
} from '../forms';
import { HomeworkCompletionHistory } from '../homework/HomeworkCompletionHistory';
import { homeworkApi, HomeworkResponse, HomeworkCompletionRequest } from '../../lib/api';
import { toast } from 'sonner';

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
  const [homeworkFormOpen, setHomeworkFormOpen] = useState(false);
  const [completionFormOpen, setCompletionFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [selectedApiHomework, setSelectedApiHomework] = useState<HomeworkResponse | null>(null);
  const [apiHomework, setApiHomework] = useState<HomeworkResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewLogOpen, setViewLogOpen] = useState(false);

  // Fetch homework from API
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        setLoading(true);
        const data = await homeworkApi.listHomework(clientId, filter === 'active');
        setApiHomework(data);
      } catch (error) {
        console.error('Error fetching homework:', error);
        // Silently fail and use mock data
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [clientId, filter]);

  const activeHomework = homework.filter(h => h.status !== 'not-worked');
  const displayHomework = filter === 'active' ? activeHomework : homework;

  const handleCreateHomework = (data: HomeworkFormData) => {
    console.log('Creating homework:', data);
    // TODO: Implement API call
    setHomeworkFormOpen(false);
    setEditingHomework(null);
  };

  const handleEditHomework = (hw: Homework) => {
    setEditingHomework(hw);
    setHomeworkFormOpen(true);
  };

  const handleLogCompletion = (hw: Homework) => {
    setSelectedHomework(hw);
    setCompletionFormOpen(true);
  };

  const handleSubmitCompletion = (data: HomeworkCompletionData) => {
    console.log('Logging completion:', data, 'for homework:', selectedHomework?.id);
    // TODO: Implement API call
    setCompletionFormOpen(false);
    setSelectedHomework(null);
  };

  const handleSubmitCompletionApi = async (data: HomeworkCompletionData) => {
    if (!selectedApiHomework) return;

    try {
      const request: HomeworkCompletionRequest = {
        completionDate: data.completionDate,
        frequencyCount: data.frequencyCount,
        durationMinutes: data.durationMinutes,
        status: data.status,
        notes: data.notes,
        loggedByParent: data.loggedByParent,
      };

      await homeworkApi.logCompletion(clientId, selectedApiHomework.id, request);
      toast.success('Completion logged successfully');
      
      // Refresh homework list
      const updated = await homeworkApi.listHomework(clientId, filter === 'active');
      setApiHomework(updated);
      
      setCompletionFormOpen(false);
      setSelectedApiHomework(null);
    } catch (error) {
      toast.error('Failed to log completion. Please try again.');
      console.error('Error logging completion:', error);
    }
  };

  const handleDeleteHomework = (hw: Homework) => {
    setSelectedHomework(hw);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting homework:', selectedHomework?.id);
    // TODO: Implement API call
    toast.success('Homework deleted successfully');
    setDeleteDialogOpen(false);
    setSelectedHomework(null);
  };

  const handleViewLog = (hw: HomeworkResponse) => {
    setSelectedApiHomework(hw);
    setViewLogOpen(true);
  };

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
        <Button 
          onClick={() => {
            setEditingHomework(null);
            setHomeworkFormOpen(true);
          }}
          className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]"
        >
          <Plus className="size-4" />
          Assign Homework
        </Button>
      </div>

      {/* Homework List */}
      {displayHomework.length === 0 && apiHomework.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No homework assigned yet</p>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setHomeworkFormOpen(true)}
            >
              <Plus className="size-4" />
              Assign First Homework
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* API Homework (from backend) */}
          {apiHomework.map(hw => {
            const statusColor = statusColors[hw.status] || statusColors['not-started'];
            const statusLabel = statusLabels[hw.status] || statusLabels['not-started'];

            return (
              <Card key={hw.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TherapyBadge type={hw.therapy.toLowerCase() as any} showLabel={false} />
                        <CardTitle className="text-lg">{hw.title}</CardTitle>
                      </div>
                      {hw.description && (
                        <p className="text-sm text-slate-600">{hw.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className={statusColor}>
                      {statusLabel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-slate-400" />
                      <span className="text-slate-600">Assigned:</span>
                      <span>{formatDate(new Date(hw.assignedDate))}</span>
                    </div>
                    {hw.dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-slate-400" />
                        <span className="text-slate-600">Due:</span>
                        <span>{formatDate(new Date(hw.dueDate))}</span>
                      </div>
                    )}
                    {hw.relatedGoal && (
                      <div className="flex items-center gap-2">
                        <Target className="size-4 text-slate-400" />
                        <span className="text-slate-600">Goal:</span>
                        <span className="truncate">{hw.relatedGoal.title}</span>
                      </div>
                    )}
                    {hw.assignedByUser && (
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-slate-400" />
                        <span className="text-slate-600">Assigned by:</span>
                        <span>{hw.assignedByUser.name}</span>
                      </div>
                    )}
                  </div>

                  {hw.frequencyTarget && (
                    <div className="pt-2 border-t text-sm">
                      <span className="text-slate-600">Target Frequency: </span>
                      <span className="font-medium">{hw.frequencyTarget}</span>
                    </div>
                  )}

                  {hw.homeworkCompletions && hw.homeworkCompletions.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="text-slate-600">Completions: </span>
                        <span className="font-medium">{hw.homeworkCompletions.length} times logged</span>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleViewLog(hw)}
                    >
                      <Eye className="size-4" />
                      View Log
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => {
                        setSelectedApiHomework(hw);
                        setCompletionFormOpen(true);
                      }}
                    >
                      <Plus className="size-4" />
                      Log Completion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Mock Homework (legacy data) */}
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

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="size-4" />
                      View Log
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleLogCompletion(hw)}
                    >
                      <Plus className="size-4" />
                      Log Completion
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleEditHomework(hw)}
                    >
                      <Edit className="size-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteHomework(hw)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Homework Form Dialog */}
      <FormDialog
        open={homeworkFormOpen}
        onOpenChange={setHomeworkFormOpen}
        title={editingHomework ? 'Edit Homework' : 'Assign Homework'}
        description={editingHomework ? 'Update homework assignment details' : 'Create a new homework assignment for this client'}
        maxWidth="2xl"
      >
        <HomeworkForm
          clientId={clientId}
          onSubmit={handleCreateHomework}
          onCancel={() => {
            setHomeworkFormOpen(false);
            setEditingHomework(null);
          }}
          initialData={editingHomework ? {
            clientId: editingHomework.clientId,
            title: editingHomework.title,
            description: editingHomework.description,
            therapy: editingHomework.therapyType as 'ABA' | 'Speech' | 'OT',
            assignedDate: editingHomework.assignedDate.toISOString().split('T')[0],
            status: editingHomework.status as any,
            isActive: true,
            instructions: editingHomework.instructions,
            relatedGoalId: editingHomework.goalId,
          } : undefined}
          availableGoals={goals.filter(g => g.clientId === clientId).map(g => ({
            id: g.id,
            title: g.title,
          }))}
        />
      </FormDialog>

      {/* Completion Form Dialog */}
      <FormDialog
        open={completionFormOpen}
        onOpenChange={setCompletionFormOpen}
        title="Log Homework Completion"
        description="Record how this homework activity went"
        maxWidth="lg"
      >
        <HomeworkCompletionForm
          onSubmit={selectedApiHomework ? handleSubmitCompletionApi : handleSubmitCompletion}
          onCancel={() => {
            setCompletionFormOpen(false);
            setSelectedHomework(null);
            setSelectedApiHomework(null);
          }}
          homeworkTitle={selectedApiHomework?.title || selectedHomework?.title}
          homeworkType={
            selectedApiHomework?.frequencyTarget?.includes('x') ? 'frequency' :
            selectedApiHomework?.frequencyTarget?.includes('min') ? 'duration' :
            'general'
          }
        />
      </FormDialog>

      {/* View Completion Log Dialog */}
      {selectedApiHomework && (
        <FormDialog
          open={viewLogOpen}
          onOpenChange={setViewLogOpen}
          title="Homework Completion Log"
          description="View all completion entries for this homework"
          maxWidth="3xl"
        >
          <HomeworkCompletionHistory
            homework={selectedApiHomework}
            onClose={() => {
              setViewLogOpen(false);
              setSelectedApiHomework(null);
            }}
          />
        </FormDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={selectedHomework?.title}
        itemType="homework assignment"
      />
    </div>
  );
}