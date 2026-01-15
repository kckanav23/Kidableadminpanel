import type { Goal, GoalStatus, TherapyType } from '@/types';
import type { GoalProgressResponse, GoalResponse } from '@/types/api';

export function mapGoalResponseToGoal(apiGoal: GoalResponse): Goal {
  const latestProgress = apiGoal.goalProgress && apiGoal.goalProgress.length > 0 ? apiGoal.goalProgress[apiGoal.goalProgress.length - 1] : null;
  const current = latestProgress?.value ?? parseFloat(apiGoal.baselineValue || '0');

  const therapyTypeMap: Record<string, TherapyType> = {
    ABA: 'aba',
    Speech: 'speech',
    OT: 'ot',
  };
  const therapyType = therapyTypeMap[String(apiGoal.therapy)] || 'aba';

  const statusMap: Record<string, GoalStatus> = {
    active: 'active',
    achieved: 'achieved',
    on_hold: 'on-hold',
    discontinued: 'discontinued',
  };
  const status = statusMap[String(apiGoal.status)] || 'active';

  return {
    id: apiGoal.id || '',
    clientId: apiGoal.clientId || '',
    title: apiGoal.title,
    description: apiGoal.description || '',
    targetCriteria: apiGoal.targetCriteria || undefined,
    therapyType,
    baseline: parseFloat(apiGoal.baselineValue || '0'),
    target: parseFloat(apiGoal.targetValue || '100'),
    current,
    status,
    dueDate: apiGoal.targetDate ? new Date(apiGoal.targetDate) : undefined,
    createdDate: apiGoal.createdAt ? new Date(apiGoal.createdAt) : new Date(),
  };
}

export type GoalProgressEntry = {
  id: string;
  goalId: string;
  date: Date;
  value: number;
  notes?: string;
  recordedBy: string;
};

export function mapGoalProgressToEntries(goalId: string, progress?: GoalProgressResponse[]): GoalProgressEntry[] {
  return (progress || [])
    .filter((p): p is GoalProgressResponse & { value: number; recordedDate: string } => typeof p.value === 'number' && !!p.recordedDate)
    .map((p) => ({
      id: p.id || `${goalId}-${p.recordedDate}`,
      goalId,
      date: new Date(p.recordedDate!),
      value: p.value,
      notes: p.notes,
      recordedBy: 'Staff',
    }));
}


