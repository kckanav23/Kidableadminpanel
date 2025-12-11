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
import { CalendarIcon, Plus, X, Video } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { Switch } from '../ui/switch';

interface HomeworkFormProps {
  onSubmit: (data: HomeworkFormData) => void;
  onCancel: () => void;
  initialData?: Partial<HomeworkFormData>;
  clientId: string;
  availableGoals?: Array<{ id: string; title: string }>;
}

export interface HomeworkFormData {
  clientId: string;
  title: string;
  description?: string;
  therapy: 'ABA' | 'Speech' | 'OT';
  frequencyTarget?: string;
  assignedDate: string;
  dueDate?: string;
  status: 'worked' | 'not_worked' | 'yet_to_try' | 'not_started';
  isActive: boolean;
  instructions?: string;
  videoUrl?: string;
  relatedGoalId?: string;
}

const therapyOptions = [
  { value: 'ABA', label: 'ABA Therapy' },
  { value: 'Speech', label: 'Speech Therapy' },
  { value: 'OT', label: 'Occupational Therapy' },
];

const frequencyTemplates = [
  '1x daily (5 min)',
  '2x daily (10 min)',
  'Daily (5 min)',
  'Daily (10 min)',
  '3x weekly (15 min)',
  '5x weekly (20 min)',
  'Custom',
];

export function HomeworkForm({
  onSubmit,
  onCancel,
  initialData,
  clientId,
  availableGoals = [],
}: HomeworkFormProps) {
  const [formData, setFormData] = useState<HomeworkFormData>({
    clientId,
    title: initialData?.title || '',
    description: initialData?.description || '',
    therapy: initialData?.therapy || 'ABA',
    frequencyTarget: initialData?.frequencyTarget || '',
    assignedDate: initialData?.assignedDate || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate,
    status: initialData?.status || 'not_started',
    isActive: initialData?.isActive ?? true,
    instructions: initialData?.instructions || '',
    videoUrl: initialData?.videoUrl || '',
    relatedGoalId: initialData?.relatedGoalId,
  });

  const [assignedDateOpen, setAssignedDateOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [instructionsList, setInstructionsList] = useState<string[]>(
    initialData?.instructions?.split('\n').filter(Boolean) || []
  );
  const [newInstruction, setNewInstruction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a homework title');
      return;
    }

    if (!formData.therapy) {
      toast.error('Please select a therapy type');
      return;
    }

    // Combine instructions list into newline-separated string
    const finalData = {
      ...formData,
      instructions: instructionsList.join('\n'),
    };

    onSubmit(finalData);
    toast.success(initialData ? 'Homework updated successfully' : 'Homework assigned successfully');
  };

  const addInstruction = () => {
    if (!newInstruction.trim()) return;
    setInstructionsList([...instructionsList, newInstruction.trim()]);
    setNewInstruction('');
  };

  const removeInstruction = (index: number) => {
    setInstructionsList(instructionsList.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Homework Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Practice counting to 10"
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
          placeholder="Brief overview of the homework activity..."
          rows={2}
        />
      </div>

      {/* Therapy Type & Related Goal */}
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
          <Label htmlFor="relatedGoal">
            Related Goal <span className="text-slate-400">(Optional)</span>
          </Label>
          <Select
            value={formData.relatedGoalId || 'none'}
            onValueChange={(value) => setFormData({ ...formData, relatedGoalId: value === 'none' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a goal..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {availableGoals.map((goal) => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Frequency Target */}
      <div className="space-y-2">
        <Label htmlFor="frequencyTarget">
          Frequency Target <span className="text-slate-400">(Optional)</span>
        </Label>
        <div className="flex gap-2">
          <Select
            value={formData.frequencyTarget}
            onValueChange={(value) => setFormData({ ...formData, frequencyTarget: value })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select or enter custom..." />
            </SelectTrigger>
            <SelectContent>
              {frequencyTemplates.map((template) => (
                <SelectItem key={template} value={template}>
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {formData.frequencyTarget === 'Custom' && (
          <Input
            value={formData.frequencyTarget}
            onChange={(e) => setFormData({ ...formData, frequencyTarget: e.target.value })}
            placeholder="e.g., 3x weekly (15 min)"
            className="mt-2"
          />
        )}
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assignedDate">Assigned Date</Label>
          <Popover open={assignedDateOpen} onOpenChange={setAssignedDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left',
                  !formData.assignedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.assignedDate ? formatDate(new Date(formData.assignedDate)) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.assignedDate ? new Date(formData.assignedDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setFormData({ ...formData, assignedDate: date.toISOString().split('T')[0] });
                    setAssignedDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">
            Due Date <span className="text-slate-400">(Optional)</span>
          </Label>
          <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left',
                  !formData.dueDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.dueDate ? formatDate(new Date(formData.dueDate)) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setFormData({ ...formData, dueDate: date.toISOString().split('T')[0] });
                    setDueDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <Label>
          Step-by-Step Instructions <span className="text-slate-400">(Optional)</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInstruction();
              }
            }}
            placeholder="Add an instruction step..."
          />
          <Button type="button" onClick={addInstruction} variant="outline" size="icon">
            <Plus className="size-4" />
          </Button>
        </div>
        {instructionsList.length > 0 && (
          <ol className="space-y-2 mt-3">
            {instructionsList.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                <span className="text-slate-600 mt-0.5">{index + 1}.</span>
                <span className="flex-1">{instruction}</span>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-slate-400 hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Video URL */}
      <div className="space-y-2">
        <Label htmlFor="videoUrl">
          Video URL <span className="text-slate-400">(Optional)</span>
        </Label>
        <div className="flex gap-2">
          <Video className="size-4 text-slate-400 mt-3" />
          <Input
            id="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <p className="text-xs text-slate-500">Add a demonstration video to help parents understand the activity</p>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex-1">
          <Label htmlFor="isActive">Active Status</Label>
          <p className="text-sm text-slate-600 mt-1">
            Active homework appears in the parent app and client dashboard
          </p>
        </div>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>

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
          {initialData ? 'Update Homework' : 'Assign Homework'}
        </Button>
      </div>
    </form>
  );
}