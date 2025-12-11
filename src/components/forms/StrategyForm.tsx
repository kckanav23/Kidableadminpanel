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
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Switch } from '../ui/switch';

interface StrategyFormProps {
  onSubmit: (data: StrategyFormData) => void;
  onCancel: () => void;
  initialData?: Partial<StrategyFormData>;
  mode?: 'create' | 'assign';
  clientId?: string;
}

export interface StrategyFormData {
  title: string;
  description?: string;
  type: 'antecedent' | 'reinforcement' | 'regulation';
  whenToUse?: string;
  howToUse?: string;
  steps?: string[];
  examples?: string[];
  isGlobal?: boolean;
  effectiveness?: string;
  customNotes?: string;
  customExamples?: string[];
}

const strategyTypes = [
  { value: 'antecedent', label: 'Antecedent Strategy', desc: 'Prevent challenges before they occur' },
  { value: 'reinforcement', label: 'Reinforcement Strategy', desc: 'Encourage positive behaviors' },
  { value: 'regulation', label: 'Regulation Strategy', desc: 'Help manage emotions and behaviors' },
];

const effectivenessOptions = [
  'Very Effective',
  'Effective',
  'Somewhat Effective',
  'Not Effective',
  'Not Yet Assessed',
];

export function StrategyForm({
  onSubmit,
  onCancel,
  initialData,
  mode = 'create',
  clientId,
}: StrategyFormProps) {
  const [formData, setFormData] = useState<StrategyFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'antecedent',
    whenToUse: initialData?.whenToUse || '',
    howToUse: initialData?.howToUse || '',
    steps: initialData?.steps || [],
    examples: initialData?.examples || [],
    isGlobal: initialData?.isGlobal ?? true,
    effectiveness: initialData?.effectiveness || '',
    customNotes: initialData?.customNotes || '',
    customExamples: initialData?.customExamples || [],
  });

  const [newStep, setNewStep] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCustomExample, setNewCustomExample] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a strategy title');
      return;
    }

    if (!formData.type) {
      toast.error('Please select a strategy type');
      return;
    }

    onSubmit(formData);
    toast.success(mode === 'assign' ? 'Strategy assigned successfully' : 'Strategy saved successfully');
  };

  const addToList = (field: 'steps' | 'examples' | 'customExamples', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    const currentList = formData[field] || [];
    setFormData({
      ...formData,
      [field]: [...currentList, value.trim()],
    });
    setter('');
  };

  const removeFromList = (field: 'steps' | 'examples' | 'customExamples', index: number) => {
    const currentList = formData[field] || [];
    setFormData({
      ...formData,
      [field]: currentList.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Strategy Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Visual Schedule"
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
          placeholder="Brief overview of this strategy..."
          rows={2}
        />
      </div>

      {/* Strategy Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Strategy Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {strategyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex flex-col items-start">
                  <span>{type.label}</span>
                  <span className="text-xs text-slate-500">{type.desc}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* When to Use */}
      <div className="space-y-2">
        <Label htmlFor="whenToUse">
          When to Use <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="whenToUse"
          value={formData.whenToUse}
          onChange={(e) => setFormData({ ...formData, whenToUse: e.target.value })}
          placeholder="Situations where this strategy is most effective..."
          rows={2}
        />
      </div>

      {/* How to Use */}
      <div className="space-y-2">
        <Label htmlFor="howToUse">
          How to Use <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="howToUse"
          value={formData.howToUse}
          onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
          placeholder="Instructions for implementing this strategy..."
          rows={3}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <Label>
          Step-by-Step Instructions <span className="text-slate-400">(Optional)</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToList('steps', newStep, setNewStep);
              }
            }}
            placeholder="Add a step..."
          />
          <Button
            type="button"
            onClick={() => addToList('steps', newStep, setNewStep)}
            variant="outline"
            size="icon"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {formData.steps && formData.steps.length > 0 && (
          <ol className="space-y-2 mt-3">
            {formData.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                <span className="text-slate-600 mt-0.5">{index + 1}.</span>
                <span className="flex-1">{step}</span>
                <button
                  type="button"
                  onClick={() => removeFromList('steps', index)}
                  className="text-slate-400 hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <Label>
          General Examples <span className="text-slate-400">(Optional)</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToList('examples', newExample, setNewExample);
              }
            }}
            placeholder="Add an example..."
          />
          <Button
            type="button"
            onClick={() => addToList('examples', newExample, setNewExample)}
            variant="outline"
            size="icon"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {formData.examples && formData.examples.length > 0 && (
          <ul className="space-y-2 mt-3">
            {formData.examples.map((example, index) => (
              <li key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                <span className="text-slate-600 mt-0.5">•</span>
                <span className="flex-1">{example}</span>
                <button
                  type="button"
                  onClick={() => removeFromList('examples', index)}
                  className="text-slate-400 hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Client-Specific Section (if assigning to client) */}
      {mode === 'assign' && clientId && (
        <>
          <div className="border-t pt-4">
            <h4 className="mb-4">Client-Specific Customization</h4>

            {/* Custom Notes */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="customNotes">
                Custom Notes for This Client <span className="text-slate-400">(Optional)</span>
              </Label>
              <Textarea
                id="customNotes"
                value={formData.customNotes}
                onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                placeholder="Specific notes or modifications for this client..."
                rows={3}
              />
            </div>

            {/* Custom Examples */}
            <div className="space-y-2">
              <Label>
                Custom Examples for This Client <span className="text-slate-400">(Optional)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newCustomExample}
                  onChange={(e) => setNewCustomExample(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('customExamples', newCustomExample, setNewCustomExample);
                    }
                  }}
                  placeholder="Add a client-specific example..."
                />
                <Button
                  type="button"
                  onClick={() => addToList('customExamples', newCustomExample, setNewCustomExample)}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.customExamples && formData.customExamples.length > 0 && (
                <ul className="space-y-2 mt-3">
                  {formData.customExamples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                      <span className="text-slate-600 mt-0.5">•</span>
                      <span className="flex-1">{example}</span>
                      <button
                        type="button"
                        onClick={() => removeFromList('customExamples', index)}
                        className="text-slate-400 hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Effectiveness */}
            <div className="space-y-2 mt-4">
              <Label htmlFor="effectiveness">
                Effectiveness Rating <span className="text-slate-400">(Optional)</span>
              </Label>
              <Select
                value={formData.effectiveness}
                onValueChange={(value) => setFormData({ ...formData, effectiveness: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating..." />
                </SelectTrigger>
                <SelectContent>
                  {effectivenessOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      {/* Global Strategy Toggle (only in create mode) */}
      {mode === 'create' && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <Label htmlFor="isGlobal">Global Strategy</Label>
            <p className="text-sm text-slate-600 mt-1">
              Make this strategy available to all clients
            </p>
          </div>
          <Switch
            id="isGlobal"
            checked={formData.isGlobal}
            onCheckedChange={(checked) => setFormData({ ...formData, isGlobal: checked })}
          />
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
          {mode === 'assign' ? 'Assign Strategy' : initialData ? 'Update Strategy' : 'Create Strategy'}
        </Button>
      </div>
    </form>
  );
}
