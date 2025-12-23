import { useState } from 'react';
import { AlertCircle, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type HomeworkCompletionData = {
  completionDate: string;
  frequencyCount?: number;
  durationMinutes?: number;
  status: 'worked' | 'not_worked' | 'yet_to_try' | 'not_started';
  notes?: string;
  loggedByParent?: string;
};

const STATUS_OPTIONS = [
  {
    value: 'worked',
    label: 'Worked Well',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    desc: 'Activity went smoothly',
  },
  {
    value: 'not_worked',
    label: 'Did Not Work',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    desc: 'Activity was challenging',
  },
  {
    value: 'yet_to_try',
    label: 'Yet to Try',
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
    desc: 'Attempted but incomplete',
  },
  {
    value: 'not_started',
    label: 'Not Started',
    icon: Circle,
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 border-slate-200',
    desc: 'Not attempted yet',
  },
] as const;

export function HomeworkCompletionForm({
  onSubmit,
  onCancel,
  homeworkTitle,
  homeworkType = 'general',
  initialData,
}: {
  onSubmit: (data: HomeworkCompletionData) => void;
  onCancel: () => void;
  homeworkTitle?: string;
  homeworkType?: 'frequency' | 'duration' | 'general';
  initialData?: Partial<HomeworkCompletionData>;
}) {
  const [formData, setFormData] = useState<HomeworkCompletionData>({
    completionDate: initialData?.completionDate || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'worked',
    frequencyCount: initialData?.frequencyCount,
    durationMinutes: initialData?.durationMinutes,
    notes: initialData?.notes || '',
    loggedByParent: initialData?.loggedByParent,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.status) {
      toast.error('Please select a status');
      return;
    }

    if (homeworkType === 'frequency' && formData.status === 'worked' && !formData.frequencyCount) {
      toast.error('Please enter how many times completed');
      return;
    }

    if (homeworkType === 'duration' && formData.status === 'worked' && !formData.durationMinutes) {
      toast.error('Please enter duration in minutes');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {homeworkTitle ? (
        <div className="p-3 bg-accent rounded-lg">
          <p className="text-sm text-slate-600">Logging completion for:</p>
          <p>{homeworkTitle}</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="completionDate">Completion Date</Label>
        <Input
          id="completionDate"
          type="date"
          value={formData.completionDate}
          onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="space-y-3">
        <Label>Status *</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {STATUS_OPTIONS.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => setFormData({ ...formData, status: status.value })}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left',
                  formData.status === status.value ? 'border-primary bg-accent shadow-sm' : status.bgColor
                )}
              >
                <Icon className={cn('size-5 mt-0.5 shrink-0', status.color)} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{status.label}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{status.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {homeworkType === 'frequency' && formData.status === 'worked' ? (
        <div className="space-y-2">
          <Label htmlFor="frequencyCount">Times Completed</Label>
          <Input
            id="frequencyCount"
            type="number"
            min="0"
            value={formData.frequencyCount || ''}
            onChange={(e) => setFormData({ ...formData, frequencyCount: parseInt(e.target.value, 10) || undefined })}
            placeholder="e.g., 5"
          />
          <p className="text-xs text-slate-500">How many times was this activity completed?</p>
        </div>
      ) : null}

      {homeworkType === 'duration' && formData.status === 'worked' ? (
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duration (minutes)</Label>
          <Input
            id="durationMinutes"
            type="number"
            min="0"
            value={formData.durationMinutes || ''}
            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) || undefined })}
            placeholder="e.g., 15"
          />
          <p className="text-xs text-slate-500">How many minutes did this activity last?</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="What happened? Any observations or challenges..."
          rows={4}
          maxLength={2000}
        />
        <p className="text-xs text-slate-500 text-right">{formData.notes?.length || 0} / 2000</p>
      </div>

      {formData.status === 'not_worked' ? (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-900">
            <span className="font-medium">Tip:</span> Note what made this challenging so the therapist can adjust the approach.
          </p>
        </div>
      ) : null}

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-[#0B5B45] hover:bg-[#0D6953]">
          Log Completion
        </Button>
      </div>
    </form>
  );
}


