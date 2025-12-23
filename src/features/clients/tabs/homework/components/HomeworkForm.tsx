import { useMemo, useState } from 'react';
import { Plus, Video, X } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export type HomeworkFormData = {
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
};

export function HomeworkForm({
  onSubmit,
  onCancel,
  initialData,
  clientId,
  availableGoals = [],
}: {
  onSubmit: (data: HomeworkFormData) => void;
  onCancel: () => void;
  initialData?: Partial<HomeworkFormData>;
  clientId: string;
  availableGoals?: Array<{ id: string; title: string }>;
}) {
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

  const initialInstructions = useMemo(() => initialData?.instructions?.split('\n').filter(Boolean) || [], [initialData?.instructions]);
  const [instructionsList, setInstructionsList] = useState<string[]>(initialInstructions);
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

    onSubmit({ ...formData, instructions: instructionsList.join('\n') });
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
      <div className="space-y-2">
        <Label htmlFor="title">Homework Title *</Label>
        <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Practice counting to 10" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief overview of the homework activity..." rows={2} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="therapy">Therapy Type *</Label>
          <Select
            value={formData.therapy}
            onValueChange={(value: string) => setFormData({ ...formData, therapy: value as HomeworkFormData['therapy'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ABA">ABA Therapy</SelectItem>
              <SelectItem value="Speech">Speech Therapy</SelectItem>
              <SelectItem value="OT">Occupational Therapy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="relatedGoal">
            Related Goal <span className="text-slate-400">(Optional)</span>
          </Label>
          <Select
            value={formData.relatedGoalId || 'none'}
            onValueChange={(value: string) => setFormData({ ...formData, relatedGoalId: value === 'none' ? undefined : value })}
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

      <div className="space-y-2">
        <Label htmlFor="frequencyTarget">
          Frequency Target <span className="text-slate-400">(Optional)</span>
        </Label>
        <Input value={formData.frequencyTarget} onChange={(e) => setFormData({ ...formData, frequencyTarget: e.target.value })} placeholder="e.g., 3x weekly (15 min)" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assignedDate">Assigned Date</Label>
          <Input
            id="assignedDate"
            type="date"
            value={formData.assignedDate}
            onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">
            Due Date <span className="text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || undefined })}
          />
        </div>
      </div>

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
        {instructionsList.length > 0 ? (
          <ol className="space-y-2 mt-3">
            {instructionsList.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                <span className="text-slate-600 mt-0.5">{index + 1}.</span>
                <span className="flex-1">{instruction}</span>
                <button type="button" onClick={() => removeInstruction(index)} className="text-slate-400 hover:text-destructive">
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">
          Video URL <span className="text-slate-400">(Optional)</span>
        </Label>
        <div className="flex gap-2">
          <Video className="size-4 text-slate-400 mt-3" />
          <Input id="videoUrl" type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <p className="text-xs text-slate-500">Add a demonstration video to help parents understand the activity</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex-1">
          <Label htmlFor="isActive">Active Status</Label>
          <p className="text-sm text-slate-600 mt-1">Active homework appears in the parent app and client dashboard</p>
        </div>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-[#0B5B45] hover:bg-[#0D6953]">
          {initialData ? 'Update Homework' : 'Assign Homework'}
        </Button>
      </div>
    </form>
  );
}


