import { useState } from 'react';
import { Goal } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CalendarIcon, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { formatDate, cn } from '../../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { Card, CardContent } from '../../ui/card';

interface LogProgressFormProps {
  goal: Goal;
  onSubmit: (data: ProgressLogData) => void;
  onCancel: () => void;
}

export interface ProgressLogData {
  goalId: string;
  date: string;
  value: number;
  notes?: string;
}

export function LogProgressForm({ goal, onSubmit, onCancel }: LogProgressFormProps) {
  const [formData, setFormData] = useState<ProgressLogData>({
    goalId: goal.id,
    date: new Date().toISOString().split('T')[0],
    value: goal.current,
    notes: '',
  });

  const [dateOpen, setDateOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.value < 0 || formData.value > 100) {
      toast.error('Progress value must be between 0 and 100');
      return;
    }

    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }

    onSubmit(formData);
    toast.success('Progress logged successfully');
  };

  const progressChange = formData.value - goal.current;
  const progressToTarget = goal.target - formData.value;
  const progressPercent = ((formData.value - goal.baseline) / (goal.target - goal.baseline)) * 100;

  // Quick value buttons
  const quickValues = [
    { label: 'Target', value: goal.target },
    { label: 'Current', value: goal.current },
    { label: '+5%', value: Math.min(100, goal.current + 5) },
    { label: '+10%', value: Math.min(100, goal.current + 10) },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Goal Summary */}
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium mb-1">{goal.title}</h4>
              <p className="text-sm text-slate-600">{goal.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Baseline</span>
              <div className="font-medium">{goal.baseline}%</div>
            </div>
            <div>
              <span className="text-slate-600">Current</span>
              <div className="font-medium text-[#0B5B45]">{goal.current}%</div>
            </div>
            <div>
              <span className="text-slate-600">Target</span>
              <div className="font-medium">{goal.target}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left',
                !formData.date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {formData.date ? formatDate(new Date(formData.date)) : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.date ? new Date(formData.date) : undefined}
              onSelect={(date) => {
                if (date) {
                  setFormData({ ...formData, date: date.toISOString().split('T')[0] });
                  setDateOpen(false);
                }
              }}
              initialFocus
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-slate-500">Cannot be in the future</p>
      </div>

      {/* Progress Value */}
      <div className="space-y-2">
        <Label htmlFor="value">Progress Value (%) *</Label>
        <Input
          id="value"
          type="number"
          min="0"
          max="100"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
          required
          className="text-lg"
        />
        
        {/* Quick Value Buttons */}
        <div className="flex gap-2 flex-wrap">
          {quickValues.map((qv) => (
            <Button
              key={qv.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData({ ...formData, value: qv.value })}
              className="text-xs"
            >
              {qv.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      {formData.value !== goal.current && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className={progressChange > 0 ? 'bg-green-50 border-green-200' : progressChange < 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50'}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                {progressChange > 0 ? (
                  <TrendingUp className="size-4 text-green-600" />
                ) : progressChange < 0 ? (
                  <TrendingDown className="size-4 text-red-600" />
                ) : (
                  <TrendingUp className="size-4 text-slate-400" />
                )}
                <span className="text-xs text-slate-600">Change</span>
              </div>
              <div className={`text-xl font-bold ${
                progressChange > 0 ? 'text-green-600' : progressChange < 0 ? 'text-red-600' : 'text-slate-600'
              }`}>
                {progressChange > 0 ? '+' : ''}{progressChange}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="size-4 text-slate-400" />
                <span className="text-xs text-slate-600">To Target</span>
              </div>
              <div className="text-xl font-bold">{progressToTarget}%</div>
            </CardContent>
          </Card>

          <Card className="bg-[#0B5B45]/5 border-[#0B5B45]/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="size-4 text-[#0B5B45]" />
                <span className="text-xs text-slate-600">Overall Progress</span>
              </div>
              <div className="text-xl font-bold text-[#0B5B45]">
                {Math.max(0, Math.min(100, Math.round(progressPercent)))}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Progress Notes <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any observations, context, or notes about this progress entry..."
          rows={4}
        />
        <p className="text-xs text-slate-500">
          Include relevant details about the assessment, environmental factors, or strategies used
        </p>
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
          Log Progress
        </Button>
      </div>
    </form>
  );
}
