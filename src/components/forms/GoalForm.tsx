import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  onCancel: () => void;
  initialData?: Partial<GoalFormData>;
  clientId: string;
}

export interface GoalFormData {
  clientId: string;
  title: string;
  description?: string;
  therapy: 'ABA' | 'Speech' | 'OT';
  category?: string;
  targetCriteria?: string;
  baselineValue?: string;
  targetValue?: string;
  status: 'active' | 'achieved' | 'discontinued' | 'on_hold';
  startDate: string;
  targetDate?: string;
  achievedDate?: string;
  masteryCriteria?: string;
}

const therapyOptions = [
  { value: 'ABA', label: 'ABA Therapy' },
  { value: 'Speech', label: 'Speech Therapy' },
  { value: 'OT', label: 'Occupational Therapy' },
];

const statusOptions = [
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'achieved', label: 'Achieved', color: 'text-blue-600' },
  { value: 'on_hold', label: 'On Hold', color: 'text-yellow-600' },
  { value: 'discontinued', label: 'Discontinued', color: 'text-slate-600' },
];

const categoryOptions = [
  'Communication',
  'Social Skills',
  'Daily Living',
  'Academic',
  'Motor Skills',
  'Behavioral',
  'Self-Regulation',
  'Play Skills',
  'Other',
];

export function GoalForm({ onSubmit, onCancel, initialData, clientId }: GoalFormProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    clientId,
    title: initialData?.title || '',
    description: initialData?.description || '',
    therapy: initialData?.therapy || 'ABA',
    category: initialData?.category || '',
    targetCriteria: initialData?.targetCriteria || '',
    baselineValue: initialData?.baselineValue || '',
    targetValue: initialData?.targetValue || '',
    status: initialData?.status || 'active',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    targetDate: initialData?.targetDate,
    achievedDate: initialData?.achievedDate,
    masteryCriteria: initialData?.masteryCriteria || '',
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [targetDateOpen, setTargetDateOpen] = useState(false);
  const [achievedDateOpen, setAchievedDateOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    if (!formData.therapy) {
      toast.error('Please select a therapy type');
      return;
    }

    if (!formData.status) {
      toast.error('Please select a goal status');
      return;
    }

    onSubmit(formData);
    toast.success(initialData ? 'Goal updated successfully' : 'Goal created successfully');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
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

      {/* Description */}
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

      {/* Therapy Type & Category */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="therapy">Therapy Type *</Label>
          <Select
            value={formData.therapy}
            onValueChange={(value) => setFormData({ ...formData, therapy: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {therapyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-slate-400">(Optional)</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Baseline & Target Values */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="baselineValue">
            Baseline Value <span className="text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="baselineValue"
            value={formData.baselineValue}
            onChange={(e) => setFormData({ ...formData, baselineValue: e.target.value })}
            placeholder="e.g., 2 words per sentence"
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
            placeholder="e.g., 5 words per sentence"
          />
        </div>
      </div>

      {/* Target Criteria */}
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

      {/* Mastery Criteria */}
      <div className="space-y-2">
        <Label htmlFor="masteryCriteria">
          Mastery Criteria <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="masteryCriteria"
          value={formData.masteryCriteria}
          onChange={(e) => setFormData({ ...formData, masteryCriteria: e.target.value })}
          placeholder="e.g., 80% accuracy across 3 consecutive sessions"
          rows={2}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={option.color}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left',
                  !formData.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.startDate ? formatDate(new Date(formData.startDate)) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setFormData({ ...formData, startDate: date.toISOString().split('T')[0] });
                    setStartDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetDate">
            Target Date <span className="text-slate-400">(Optional)</span>
          </Label>
          <Popover open={targetDateOpen} onOpenChange={setTargetDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left',
                  !formData.targetDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.targetDate ? formatDate(new Date(formData.targetDate)) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.targetDate ? new Date(formData.targetDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setFormData({ ...formData, targetDate: date.toISOString().split('T')[0] });
                    setTargetDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Achieved Date (only show if status is achieved) */}
      {formData.status === 'achieved' && (
        <div className="space-y-2">
          <Label htmlFor="achievedDate">
            Achieved Date <span className="text-slate-400">(Optional)</span>
          </Label>
          <Popover open={achievedDateOpen} onOpenChange={setAchievedDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left',
                  !formData.achievedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.achievedDate ? formatDate(new Date(formData.achievedDate)) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.achievedDate ? new Date(formData.achievedDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setFormData({ ...formData, achievedDate: date.toISOString().split('T')[0] });
                    setAchievedDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#0B5B45] hover:bg-[#0D6953]"
        >
          {initialData ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
}
