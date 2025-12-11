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
import { CalendarIcon, Smile, Zap, Circle } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

interface MoodEntryFormProps {
  onSubmit: (data: MoodEntryData) => void;
  onCancel: () => void;
  initialData?: Partial<MoodEntryData>;
  parentId?: string;
}

export interface MoodEntryData {
  parentId?: string;
  entryDate: string;
  mood: 'very_happy' | 'happy' | 'okay' | 'sad' | 'very_sad';
  zone?: 'green' | 'yellow' | 'orange' | 'red' | 'blue';
  energyLevel?: 'high' | 'medium' | 'low';
  emoji?: string;
  notes?: string;
}

const moodOptions = [
  { value: 'very_happy', label: 'Very Happy', emoji: '😄', color: 'text-green-600' },
  { value: 'happy', label: 'Happy', emoji: '🙂', color: 'text-green-500' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'text-yellow-600' },
  { value: 'sad', label: 'Sad', emoji: '😟', color: 'text-orange-600' },
  { value: 'very_sad', label: 'Very Sad', emoji: '😢', color: 'text-red-600' },
];

const zoneOptions = [
  { value: 'green', label: 'Green Zone', desc: 'Calm & Ready', color: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow Zone', desc: 'Excited or Silly', color: 'bg-yellow-500' },
  { value: 'orange', label: 'Orange Zone', desc: 'Frustrated', color: 'bg-orange-500' },
  { value: 'red', label: 'Red Zone', desc: 'Very Upset', color: 'bg-red-500' },
  { value: 'blue', label: 'Blue Zone', desc: 'Sad or Tired', color: 'bg-blue-500' },
];

const energyOptions = [
  { value: 'high', label: 'High Energy', icon: '⚡' },
  { value: 'medium', label: 'Medium Energy', icon: '➖' },
  { value: 'low', label: 'Low Energy', icon: '💤' },
];

export function MoodEntryForm({ onSubmit, onCancel, initialData, parentId }: MoodEntryFormProps) {
  const [formData, setFormData] = useState<MoodEntryData>({
    entryDate: initialData?.entryDate || new Date().toISOString().split('T')[0],
    mood: initialData?.mood || 'okay',
    zone: initialData?.zone,
    energyLevel: initialData?.energyLevel,
    emoji: initialData?.emoji || '',
    notes: initialData?.notes || '',
    parentId: initialData?.parentId || parentId,
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mood) {
      toast.error('Please select a mood');
      return;
    }

    onSubmit(formData);
    toast.success('Mood entry saved successfully');
  };

  const selectedMood = moodOptions.find(m => m.value === formData.mood);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="entryDate">Entry Date</Label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left',
                !formData.entryDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {formData.entryDate ? formatDate(new Date(formData.entryDate)) : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.entryDate ? new Date(formData.entryDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  setFormData({ ...formData, entryDate: date.toISOString().split('T')[0] });
                  setDatePickerOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mood Selection (Required) */}
      <div className="space-y-3">
        <Label>Mood *</Label>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setFormData({ ...formData, mood: mood.value as any })}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:scale-105',
                formData.mood === mood.value
                  ? 'border-primary bg-accent shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs text-center">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Zone (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="zone">
          Zone <span className="text-slate-400">(Optional)</span>
        </Label>
        <Select
          value={formData.zone || ''}
          onValueChange={(value) => setFormData({ ...formData, zone: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a zone..." />
          </SelectTrigger>
          <SelectContent>
            {zoneOptions.map((zone) => (
              <SelectItem key={zone.value} value={zone.value}>
                <div className="flex items-center gap-2">
                  <div className={cn('size-3 rounded-full', zone.color)} />
                  <span>{zone.label}</span>
                  <span className="text-slate-500 text-sm">- {zone.desc}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Energy Level (Optional) */}
      <div className="space-y-2">
        <Label>
          Energy Level <span className="text-slate-400">(Optional)</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {energyOptions.map((energy) => (
            <button
              key={energy.value}
              type="button"
              onClick={() => setFormData({ ...formData, energyLevel: energy.value as any })}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all',
                formData.energyLevel === energy.value
                  ? 'border-primary bg-accent'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <span>{energy.icon}</span>
              <span className="text-sm">{energy.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Emoji (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="emoji">
          Custom Emoji <span className="text-slate-400">(Optional, max 8 characters)</span>
        </Label>
        <Input
          id="emoji"
          value={formData.emoji}
          onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
          placeholder="Add custom emoji..."
          maxLength={8}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional observations..."
          rows={4}
          maxLength={2000}
        />
        <p className="text-xs text-slate-500 text-right">
          {formData.notes?.length || 0} / 2000
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
          Save Mood Entry
        </Button>
      </div>
    </form>
  );
}
