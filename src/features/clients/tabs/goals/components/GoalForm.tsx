import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export type GoalFormData = {
  clientId: string;
  title: string;
  description?: string;
  therapy: 'ABA' | 'Speech' | 'OT';
  targetCriteria?: string;
  baselineValue?: string;
  targetValue?: string;
  status: 'active' | 'achieved' | 'discontinued' | 'on_hold';
  startDate: string;
  targetDate?: string;
  achievedDate?: string;
};

const THERAPY_OPTIONS = [
  { value: 'ABA', label: 'ABA Therapy' },
  { value: 'Speech', label: 'Speech Therapy' },
  { value: 'OT', label: 'Occupational Therapy' },
] as const;

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'achieved', label: 'Achieved', color: 'text-blue-600' },
  { value: 'on_hold', label: 'On Hold', color: 'text-yellow-600' },
  { value: 'discontinued', label: 'Discontinued', color: 'text-slate-600' },
] as const;

function isTherapy(value: string): value is GoalFormData['therapy'] {
  return THERAPY_OPTIONS.some((o) => o.value === value);
}

function isStatus(value: string): value is GoalFormData['status'] {
  return STATUS_OPTIONS.some((o) => o.value === value);
}

export function GoalForm({
  onSubmit,
  onCancel,
  initialData,
  clientId,
}: {
  onSubmit: (data: GoalFormData) => void;
  onCancel: () => void;
  initialData?: Partial<GoalFormData>;
  clientId: string;
}) {
  const [formData, setFormData] = useState<GoalFormData>({
    clientId,
    title: initialData?.title || '',
    description: initialData?.description || '',
    therapy: initialData?.therapy || 'ABA',
    targetCriteria: initialData?.targetCriteria || '',
    baselineValue: initialData?.baselineValue || '',
    targetValue: initialData?.targetValue || '',
    status: initialData?.status || 'active',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    targetDate: initialData?.targetDate,
    achievedDate: initialData?.achievedDate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Goal Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Improve verbal communication"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed description of what this goal aims to achieve..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="therapy">Therapy Type *</Label>
          <Select
            value={formData.therapy}
            onValueChange={(value: string) => {
              if (isTherapy(value)) setFormData({ ...formData, therapy: value });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THERAPY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="baselineValue">
            Baseline Value <span className="text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="baselineValue"
            value={formData.baselineValue}
            onChange={(e) => setFormData({ ...formData, baselineValue: e.target.value })}
            placeholder="e.g., 20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetValue">
            Target Value <span className="text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="targetValue"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
            placeholder="e.g., 80"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetCriteria">
          Target Criteria <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="targetCriteria"
          value={formData.targetCriteria}
          onChange={(e) => setFormData({ ...formData, targetCriteria: e.target.value })}
          placeholder="Specific, measurable criteria for achieving this goal..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value: string) => {
            if (isStatus(value)) setFormData({ ...formData, status: value });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={option.color}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetDate">
            Target Date <span className="text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetDate || ''}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value || undefined })}
          />
        </div>
      </div>

      {formData.status === 'achieved' ? (
        <div className="space-y-2">
          <Label htmlFor="achievedDate">
            Achieved Date <span className="text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="achievedDate"
            type="date"
            value={formData.achievedDate || ''}
            onChange={(e) => setFormData({ ...formData, achievedDate: e.target.value || undefined })}
          />
        </div>
      ) : null}

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-[#0B5B45] hover:bg-[#0D6953]">
          {initialData ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
}


