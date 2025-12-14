import React, { useState, useEffect } from 'react';
import { Goal } from '../../types';
import type { GoalResponse, GoalCreateRequest, GoalUpdateRequest } from '../../types/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TherapyBadge } from '../badges/TherapyBadge';
import { Plus, TrendingUp, Edit, Trash2, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  FormDialog,
  GoalForm,
  DeleteConfirmDialog,
  GoalFormData,
} from '../forms';
import { GoalProgressView } from './goals/GoalProgressView';
import { LogProgressForm, ProgressLogData } from './goals/LogProgressForm';
import { getApiClient, handleApiError } from '../../lib/api-client';
import { toast } from 'sonner';

interface ClientGoalsProps {
  clientId: string;
  goals?: Goal[]; // Optional for backward compatibility, but we'll fetch from API
}

// Helper function to map API GoalResponse to component Goal interface
function mapGoalResponseToGoal(apiGoal: GoalResponse): Goal {
  // Calculate current value from latest progress entry
  const latestProgress = apiGoal.goalProgress && apiGoal.goalProgress.length > 0
    ? apiGoal.goalProgress[apiGoal.goalProgress.length - 1]
    : null;
  const current = latestProgress?.value ?? parseFloat(apiGoal.baselineValue || '0');

  // Convert therapy enum to TherapyType
  const therapyTypeMap: Record<string, 'aba' | 'speech' | 'ot'> = {
    'ABA': 'aba',
    'Speech': 'speech',
    'OT': 'ot',
  };
  const therapyType = therapyTypeMap[apiGoal.therapy] || 'aba';

  // Convert status enum to GoalStatus
  const statusMap: Record<string, 'active' | 'achieved' | 'on-hold' | 'discontinued'> = {
    'active': 'active',
    'achieved': 'achieved',
    'on_hold': 'on-hold',
    'discontinued': 'discontinued',
  };
  const status = statusMap[apiGoal.status] || 'active';

  return {
    id: apiGoal.id || '',
    clientId: apiGoal.clientId || '',
    title: apiGoal.title,
    description: apiGoal.description || '',
    therapyType,
    baseline: parseFloat(apiGoal.baselineValue || '0'),
    target: parseFloat(apiGoal.targetValue || '100'),
    current,
    status,
    dueDate: apiGoal.targetDate ? new Date(apiGoal.targetDate) : undefined,
    createdDate: apiGoal.createdAt ? new Date(apiGoal.createdAt) : new Date(),
  };
}

export function ClientGoals({ clientId, goals: initialGoals }: ClientGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals || []);
  const [loading, setLoading] = useState(!initialGoals);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [viewingGoal, setViewingGoal] = useState<Goal | null>(null);
  const [progressViewOpen, setProgressViewOpen] = useState(false);
  const [logProgressOpen, setLogProgressOpen] = useState(false);

  // Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminGoals.getGoals({
          clientId,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        });
        const mappedGoals = response.map(mapGoalResponseToGoal);
        setGoals(mappedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        toast.error('Failed to load goals');
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [clientId, statusFilter]);

  let filteredGoals = goals;
  if (statusFilter !== 'all') {
    filteredGoals = goals.filter(g => g.status === statusFilter);
  }

  const handleCreateGoal = async (data: GoalFormData) => {
    try {
      const api = getApiClient();
      const request: GoalCreateRequest = {
        title: data.title,
        description: data.description,
        therapy: data.therapy as GoalCreateRequest.therapy,
        category: data.category,
        targetCriteria: data.targetCriteria,
        baselineValue: data.baselineValue ? parseFloat(data.baselineValue) : undefined,
        targetValue: data.targetValue ? parseFloat(data.targetValue) : undefined,
        status: data.status as GoalCreateRequest.status,
        startDate: data.startDate,
        targetDate: data.targetDate,
        masteryCriteria: data.masteryCriteria,
      };

      const response = await api.adminGoals.createGoal({
        clientId,
        requestBody: request,
      });

      // Refresh goals list
      const updatedGoals = await api.adminGoals.getGoals({
        clientId,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setGoals(updatedGoals.map(mapGoalResponseToGoal));

      toast.success('Goal created successfully');
      setGoalFormOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalFormOpen(true);
  };

  const handleUpdateGoal = async (data: GoalFormData) => {
    if (!editingGoal) return;

    try {
      const api = getApiClient();
      const request: GoalUpdateRequest = {
        title: data.title,
        description: data.description,
        therapy: data.therapy as GoalUpdateRequest.therapy,
        targetCriteria: data.targetCriteria,
        baselineValue: data.baselineValue ? parseFloat(data.baselineValue) : undefined,
        targetValue: data.targetValue ? parseFloat(data.targetValue) : undefined,
        status: data.status as GoalUpdateRequest.status,
        startDate: data.startDate,
        targetDate: data.targetDate,
        achievedDate: data.achievedDate,
      };

      await api.adminGoals.updateGoal({
        clientId,
        goalId: editingGoal.id,
        requestBody: request,
      });

      // Refresh goals list
      const updatedGoals = await api.adminGoals.getGoals({
        clientId,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setGoals(updatedGoals.map(mapGoalResponseToGoal));

      toast.success('Goal updated successfully');
      setGoalFormOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedGoal) return;

    try {
      const api = getApiClient();
      await api.adminGoals.deleteGoal({
        clientId,
        goalId: selectedGoal.id,
      });

      // Refresh goals list
      const updatedGoals = await api.adminGoals.getGoals({
        clientId,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setGoals(updatedGoals.map(mapGoalResponseToGoal));

      toast.success('Goal deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleViewProgress = (goal: Goal) => {
    setViewingGoal(goal);
    setProgressViewOpen(true);
  };

  const handleLogProgress = (goal: Goal) => {
    setViewingGoal(goal);
    setLogProgressOpen(true);
  };

  const handleProgressSubmit = async (data: ProgressLogData) => {
    if (!viewingGoal) return;

    try {
      const api = getApiClient();
      await api.adminGoalProgress.addProgress({
        goalId: viewingGoal.id,
        requestBody: {
          value: data.value,
          recordedDate: data.date ? new Date(data.date).toISOString().split('T')[0] : undefined,
          notes: data.notes,
        },
      });

      // Refresh goals list to get updated progress
      const updatedGoals = await api.adminGoals.getGoals({
        clientId,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setGoals(updatedGoals.map(mapGoalResponseToGoal));

      toast.success('Progress logged successfully');
      setLogProgressOpen(false);
      setViewingGoal(null);
    } catch (error) {
      console.error('Error logging progress:', error);
      toast.error('Failed to log progress');
    }
  };

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
        <Button 
          onClick={() => {
            setEditingGoal(null);
            setGoalFormOpen(true);
          }}
          className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]"
        >
          <Plus className="size-4" />
          Add Goal
        </Button>
      </div>

      {/* Goals List */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading goals...</p>
          </CardContent>
        </Card>
      ) : filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No goals found</p>
            <Button 
              variant="outline"
              onClick={() => setGoalFormOpen(true)}
            >
              Add First Goal
            </Button>
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

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleViewProgress(goal)}
                    >
                      <TrendingUp className="size-4" />
                      View Progress
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleLogProgress(goal)}
                    >
                      <Plus className="size-4" />
                      Log Progress
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <Edit className="size-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteGoal(goal)}
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

      {/* Goal Form Dialog */}
      <FormDialog
        open={goalFormOpen}
        onOpenChange={setGoalFormOpen}
        title={editingGoal ? 'Edit Goal' : 'Add Goal'}
        description={editingGoal ? 'Update goal details and progress criteria' : 'Create a new therapy goal for this client'}
        maxWidth="2xl"
      >
        <GoalForm
          clientId={clientId}
          onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
          onCancel={() => {
            setGoalFormOpen(false);
            setEditingGoal(null);
          }}
          initialData={editingGoal ? {
            clientId: editingGoal.clientId,
            title: editingGoal.title,
            description: editingGoal.description,
            therapy: editingGoal.therapyType === 'aba' ? 'ABA' : editingGoal.therapyType === 'speech' ? 'Speech' : 'OT',
            baselineValue: editingGoal.baseline.toString(),
            targetValue: editingGoal.target.toString(),
            status: editingGoal.status === 'on-hold' ? 'on_hold' : editingGoal.status,
            startDate: editingGoal.createdDate.toISOString().split('T')[0],
            targetDate: editingGoal.dueDate?.toISOString().split('T')[0],
          } : undefined}
        />
      </FormDialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={selectedGoal?.title}
        itemType="goal"
      />

      {/* View Progress Dialog */}
      {viewingGoal && (
        <FormDialog
          open={progressViewOpen}
          onOpenChange={setProgressViewOpen}
          title="Goal Progress"
          description="Track progress and view historical data"
          maxWidth="3xl"
        >
          <GoalProgressView
            goal={viewingGoal}
            onClose={() => {
              setProgressViewOpen(false);
              setViewingGoal(null);
            }}
          />
        </FormDialog>
      )}

      {/* Log Progress Dialog */}
      {viewingGoal && (
        <FormDialog
          open={logProgressOpen}
          onOpenChange={setLogProgressOpen}
          title="Log Progress"
          description="Record a new progress measurement"
          maxWidth="xl"
        >
          <LogProgressForm
            goal={viewingGoal}
            onSubmit={handleProgressSubmit}
            onCancel={() => {
              setLogProgressOpen(false);
              setViewingGoal(null);
            }}
          />
        </FormDialog>
      )}
    </div>
  );
}