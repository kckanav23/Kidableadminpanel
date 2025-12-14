import { Homework } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TherapyBadge } from '../badges/TherapyBadge';
import { Plus, Calendar, Target, User, Edit, Eye, Trash2, Loader2 } from 'lucide-react';
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
import { HomeworkCompletionHistory } from './homework/HomeworkCompletionHistory';
import { getApiClient } from '../../lib/api-client';
import type { HomeworkResponse, HomeworkUpdateRequest, HomeworkCompletionRequest } from '../../types/api';
import { HomeworkCreateRequest } from '../../types/api';
import { toast } from 'sonner';

interface ClientHomeworkProps {
  clientId: string;
  homework?: Homework[]; // Optional for backward compatibility
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

export function ClientHomework({ clientId, homework: initialHomework }: ClientHomeworkProps) {
  const [filter, setFilter] = useState<string>('active');
  const [homeworkFormOpen, setHomeworkFormOpen] = useState(false);
  const [completionFormOpen, setCompletionFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [selectedApiHomework, setSelectedApiHomework] = useState<HomeworkResponse | null>(null);
  const [apiHomework, setApiHomework] = useState<HomeworkResponse[]>([]);
  const [loading, setLoading] = useState(!initialHomework);
  const [viewLogOpen, setViewLogOpen] = useState(false);
  const [availableGoals, setAvailableGoals] = useState<Array<{ id: string; title: string }>>([]);

  // Fetch homework from API
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        setLoading(true);
        const api = getApiClient();
        const data = await api.adminHomework.getHomework({
          clientId,
          active: filter === 'active',
        });
        setApiHomework(data);
      } catch (error) {
        console.error('Error fetching homework:', error);
        toast.error('Failed to load homework');
        setApiHomework([]);
      } finally {
        setLoading(false);
      }
    };

    if (!initialHomework) {
      fetchHomework();
    }
  }, [clientId, filter, initialHomework]);

  // Fetch available goals for the homework form
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const api = getApiClient();
        const goalsData = await api.adminGoals.getGoals({
          clientId,
          status: 'active', // Only show active goals
        });
        setAvailableGoals(goalsData.map(g => ({
          id: g.id || '',
          title: g.title,
        })));
      } catch (error) {
        console.error('Error fetching goals:', error);
        // Silently fail - goals are optional for homework
        setAvailableGoals([]);
      }
    };

    fetchGoals();
  }, [clientId]);

  // Use API homework if available, otherwise use initial homework prop
  const allHomework = apiHomework.length > 0 ? apiHomework : (initialHomework || []);
  
  // Filter homework based on active status
  const displayHomework = filter === 'active' 
    ? allHomework.filter(h => h.isActive !== false)
    : allHomework;

  const handleCreateHomework = async (data: HomeworkFormData) => {
    try {
      const api = getApiClient();
      
      // Map therapy string to enum
      const therapyMap: Record<string, HomeworkCreateRequest.therapy> = {
        'ABA': HomeworkCreateRequest.therapy.ABA,
        'Speech': HomeworkCreateRequest.therapy.SPEECH,
        'OT': HomeworkCreateRequest.therapy.OT,
      };
      
      const request: HomeworkCreateRequest = {
        title: data.title,
        description: data.description,
        instructions: data.instructions ? [data.instructions] : [],
        therapy: therapyMap[data.therapy] || HomeworkCreateRequest.therapy.ABA,
        relatedGoalId: data.relatedGoalId,
        dataType: HomeworkCreateRequest.dataType.FREQUENCY, // Default, should come from form
        active: data.isActive,
        assignedDate: data.assignedDate,
        dueDate: data.dueDate,
      };

      await api.adminHomework.createHomework({
        clientId,
        requestBody: request,
      });

      // Refresh homework list
      const updated = await api.adminHomework.getHomework({
        clientId,
        active: filter === 'active',
      });
      setApiHomework(updated);

      toast.success('Homework created successfully');
      setHomeworkFormOpen(false);
      setEditingHomework(null);
    } catch (error) {
      console.error('Error creating homework:', error);
      toast.error('Failed to create homework');
    }
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
    if (!selectedApiHomework?.id) return;

    try {
      const api = getApiClient();
      const request: HomeworkCompletionRequest = {
        completionDate: data.completionDate,
        frequencyCount: data.frequencyCount,
        durationMinutes: data.durationMinutes,
        status: data.status as HomeworkCompletionRequest.status,
        notes: data.notes,
        loggedByParent: data.loggedByParent,
      };

      await api.adminHomework.logCompletion1({
        clientId,
        homeworkId: selectedApiHomework.id,
        requestBody: request,
      });
      
      toast.success('Completion logged successfully');
      
      // Refresh homework list
      const updated = await api.adminHomework.getHomework({
        clientId,
        active: filter === 'active',
      });
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

  const confirmDelete = async () => {
    if (!selectedHomework?.id) return;

    try {
      const api = getApiClient();
      await api.adminHomework.deleteHomework({
        clientId,
        homeworkId: selectedHomework.id,
      });

      // Refresh homework list
      const updated = await api.adminHomework.getHomework({
        clientId,
        active: filter === 'active',
      });
      setApiHomework(updated);

      toast.success('Homework deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedHomework(null);
    } catch (error) {
      console.error('Error deleting homework:', error);
      toast.error('Failed to delete homework');
    }
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
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading homework...</p>
          </CardContent>
        </Card>
      ) : displayHomework.length === 0 ? (
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
          {displayHomework.map(hw => {
            const hwStatus = hw.status?.toLowerCase().replace('_', '-') || 'not-started';
            const statusColor = statusColors[hwStatus as keyof typeof statusColors] || statusColors['not-started'];
            const statusLabel = statusLabels[hwStatus as keyof typeof statusLabels] || statusLabels['not-started'];

            return (
              <Card key={hw.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TherapyBadge type={(hw.therapy?.toLowerCase() || 'aba') as 'aba' | 'speech' | 'ot'} showLabel={false} />
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
                  {hw.purpose && (
                    <p className="text-sm">
                      <span className="text-slate-600">Purpose: </span>
                      {hw.purpose}
                    </p>
                  )}

                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    {hw.assignedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-slate-400" />
                        <span className="text-slate-600">Assigned:</span>
                        <span>{formatDate(new Date(hw.assignedDate))}</span>
                      </div>
                    )}
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

                  {hw.frequency && (
                    <div className="pt-2 border-t text-sm">
                      <span className="text-slate-600">Frequency: </span>
                      <span className="font-medium">{hw.frequency}</span>
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
                    {hw.homeworkCompletions && hw.homeworkCompletions.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleViewLog(hw)}
                      >
                        <Eye className="size-4" />
                        View Log
                      </Button>
                    )}
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
                    {hw.id && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => {
                            // TODO: Implement edit functionality
                            toast.info('Edit functionality coming soon');
                          }}
                        >
                          <Edit className="size-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedHomework({ id: hw.id!, clientId: hw.clientId || '', title: hw.title, description: hw.description || '', purpose: hw.purpose || '', therapyType: (hw.therapy?.toLowerCase() || 'aba') as 'aba' | 'speech' | 'ot', status: hwStatus as any, assignedDate: hw.assignedDate ? new Date(hw.assignedDate) : new Date(), assignedById: '', goalId: hw.relatedGoalId, completionCount: hw.homeworkCompletions?.length || 0 });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </>
                    )}
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
          availableGoals={availableGoals}
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