import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ZONE_LABELS } from '@/lib/constants';
import type { StrategyResponse } from '@/types/api';
import type { StrategyFormData } from '@/features/strategyLibrary/types';

function emptyForm(globalDefault: boolean): StrategyFormData {
  return {
    title: '',
    description: '',
    type: 'antecedent',
    whenToUse: '',
    howToUse: '',
    steps: [],
    examples: [],
    targetZone: '',
    global: globalDefault,
  };
}

export function StrategyFormDialog({
  mode,
  open,
  onOpenChange,
  isSubmitting,
  initialStrategy,
  onSubmit,
  globalDefault,
}: {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  initialStrategy: StrategyResponse | null;
  onSubmit: (data: StrategyFormData) => Promise<void> | void;
  globalDefault: boolean;
}) {
  const [formData, setFormData] = useState<StrategyFormData>(() => emptyForm(globalDefault));
  const [newStep, setNewStep] = useState('');
  const [newExample, setNewExample] = useState('');

  const title = mode === 'create' ? 'Add Strategy' : 'Edit Strategy';
  const description = mode === 'create' ? 'Create a new strategy in the library' : 'Update strategy information';

  const submitLabel = mode === 'create' ? 'Create Strategy' : 'Update Strategy';

  const canSubmit = useMemo(() => !!formData.title.trim() && !isSubmitting, [formData.title, isSubmitting]);

  useEffect(() => {
    if (!open) return;

    if (mode === 'create') {
      setFormData(emptyForm(globalDefault));
      setNewStep('');
      setNewExample('');
      return;
    }

    // edit
    if (!initialStrategy) return;
    setFormData({
      title: initialStrategy.title || '',
      description: initialStrategy.description || '',
      type: (initialStrategy.type as any) || 'antecedent',
      whenToUse: initialStrategy.whenToUse || '',
      howToUse: initialStrategy.howToUse || '',
      steps: initialStrategy.steps || [],
      examples: initialStrategy.examples || [],
      targetZone: (initialStrategy.targetZone as any) || '',
      global: initialStrategy.global ?? globalDefault,
    });
    setNewStep('');
    setNewExample('');
  }, [globalDefault, initialStrategy, mode, open]);

  const addStep = () => {
    const v = newStep.trim();
    if (!v) return;
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, v] }));
    setNewStep('');
  };

  const removeStep = (index: number) => {
    setFormData((prev) => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
  };

  const addExample = () => {
    const v = newExample.trim();
    if (!v) return;
    setFormData((prev) => ({ ...prev, examples: [...prev.examples, v] }));
    setNewExample('');
  };

  const removeExample = (index: number) => {
    setFormData((prev) => ({ ...prev, examples: prev.examples.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'title' : 'edit-title'}>Title *</Label>
            <Input
              id={mode === 'create' ? 'title' : 'edit-title'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Strategy title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'description' : 'edit-description'}>Description</Label>
            <Textarea
              id={mode === 'create' ? 'description' : 'edit-description'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Strategy description"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={mode === 'create' ? 'type' : 'edit-type'}>Type *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="antecedent">Antecedent</SelectItem>
                  <SelectItem value="reinforcement">Reinforcement</SelectItem>
                  <SelectItem value="regulation">Regulation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={mode === 'create' ? 'targetZone' : 'edit-targetZone'}>Target Zone</Label>
              <Select value={formData.targetZone || undefined} onValueChange={(value: any) => setFormData({ ...formData, targetZone: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">{ZONE_LABELS.green}</SelectItem>
                  <SelectItem value="yellow">{ZONE_LABELS.yellow}</SelectItem>
                  <SelectItem value="orange">{ZONE_LABELS.orange}</SelectItem>
                  <SelectItem value="red">{ZONE_LABELS.red}</SelectItem>
                  <SelectItem value="blue">{ZONE_LABELS.blue}</SelectItem>
                </SelectContent>
              </Select>
              {formData.targetZone ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-500"
                  onClick={() => setFormData({ ...formData, targetZone: '' })}
                >
                  Clear zone
                </Button>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'whenToUse' : 'edit-whenToUse'}>When to Use</Label>
            <Textarea
              id={mode === 'create' ? 'whenToUse' : 'edit-whenToUse'}
              value={formData.whenToUse}
              onChange={(e) => setFormData({ ...formData, whenToUse: e.target.value })}
              placeholder="Describe when this strategy should be used"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'howToUse' : 'edit-howToUse'}>How to Use</Label>
            <Textarea
              id={mode === 'create' ? 'howToUse' : 'edit-howToUse'}
              value={formData.howToUse}
              onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
              placeholder="Describe how to implement this strategy"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Steps</Label>
            <div className="space-y-2">
              {formData.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm flex-1">
                    {idx + 1}. {step}
                  </span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(idx)}>
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addStep();
                    }
                  }}
                  placeholder="Add a step..."
                />
                <Button type="button" onClick={addStep} variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Examples</Label>
            <div className="space-y-2">
              {formData.examples.map((example, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm flex-1">• {example}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeExample(idx)}>
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addExample();
                    }
                  }}
                  placeholder="Add an example..."
                />
                <Button type="button" onClick={addExample} variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={mode === 'create' ? 'global' : 'edit-global'}
              checked={formData.global}
              onChange={(e) => setFormData({ ...formData, global: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor={mode === 'create' ? 'global' : 'edit-global'} className="font-normal cursor-pointer">
              Make this a global strategy
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={!canSubmit}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


