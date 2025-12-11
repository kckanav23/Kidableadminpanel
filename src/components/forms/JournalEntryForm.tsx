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
import { CalendarIcon, Clock, X, Plus } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../ui/badge';

interface JournalEntryFormProps {
  onSubmit: (data: JournalEntryData) => void;
  onCancel: () => void;
  initialData?: Partial<JournalEntryData>;
  parentId: string;
}

export interface JournalEntryData {
  parentId: string;
  entryDate: string;
  entryTime?: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  zone: 'green' | 'yellow' | 'orange' | 'red' | 'blue';
  energyGivers?: string;
  energyDrainers?: string;
  relaxingActivity?: string;
  additionalNotes?: string;
  tags?: string[];
}

const zoneOptions = [
  { value: 'green', label: 'Green Zone', desc: 'Calm & Ready to Learn', color: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow Zone', desc: 'Excited or Silly', color: 'bg-yellow-500' },
  { value: 'orange', label: 'Orange Zone', desc: 'Frustrated or Anxious', color: 'bg-orange-500' },
  { value: 'red', label: 'Red Zone', desc: 'Very Upset or Angry', color: 'bg-red-500' },
  { value: 'blue', label: 'Blue Zone', desc: 'Sad, Tired, or Sick', color: 'bg-blue-500' },
];

export function JournalEntryForm({ onSubmit, onCancel, initialData, parentId }: JournalEntryFormProps) {
  const now = new Date();
  const [formData, setFormData] = useState<JournalEntryData>({
    parentId,
    entryDate: initialData?.entryDate || now.toISOString().split('T')[0],
    entryTime: initialData?.entryTime || {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: 0,
      nano: 0,
    },
    zone: initialData?.zone || 'green',
    energyGivers: initialData?.energyGivers || '',
    energyDrainers: initialData?.energyDrainers || '',
    relaxingActivity: initialData?.relaxingActivity || '',
    additionalNotes: initialData?.additionalNotes || '',
    tags: initialData?.tags || [],
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.zone) {
      toast.error('Please select a zone');
      return;
    }

    onSubmit(formData);
    toast.success('Journal entry saved successfully');
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags && formData.tags.length >= 20) {
      toast.error('Maximum 20 tags allowed');
      return;
    }
    if (newTag.length > 50) {
      toast.error('Tag must be 50 characters or less');
      return;
    }
    
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), newTag.trim()],
    });
    setNewTag('');
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index),
    });
  };

  const handleTimeChange = (field: 'hour' | 'minute', value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData({
      ...formData,
      entryTime: {
        ...formData.entryTime!,
        [field]: field === 'hour' ? Math.min(23, Math.max(0, numValue)) : Math.min(59, Math.max(0, numValue)),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date & Time */}
      <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="space-y-2">
          <Label>Entry Time</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="23"
              value={formData.entryTime?.hour || 0}
              onChange={(e) => handleTimeChange('hour', e.target.value)}
              className="w-20 text-center"
              placeholder="HH"
            />
            <span>:</span>
            <Input
              type="number"
              min="0"
              max="59"
              value={formData.entryTime?.minute || 0}
              onChange={(e) => handleTimeChange('minute', e.target.value)}
              className="w-20 text-center"
              placeholder="MM"
            />
          </div>
        </div>
      </div>

      {/* Zone (Required) */}
      <div className="space-y-2">
        <Label htmlFor="zone">Zone of Regulation *</Label>
        <Select
          value={formData.zone}
          onValueChange={(value) => setFormData({ ...formData, zone: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
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

      {/* Energy Givers */}
      <div className="space-y-2">
        <Label htmlFor="energyGivers">
          What gave you energy today? <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="energyGivers"
          value={formData.energyGivers}
          onChange={(e) => setFormData({ ...formData, energyGivers: e.target.value })}
          placeholder="Activities, people, or moments that boosted your energy..."
          rows={3}
          maxLength={1000}
        />
        <p className="text-xs text-slate-500 text-right">
          {formData.energyGivers?.length || 0} / 1000
        </p>
      </div>

      {/* Energy Drainers */}
      <div className="space-y-2">
        <Label htmlFor="energyDrainers">
          What drained your energy? <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="energyDrainers"
          value={formData.energyDrainers}
          onChange={(e) => setFormData({ ...formData, energyDrainers: e.target.value })}
          placeholder="Challenges, situations, or feelings that were difficult..."
          rows={3}
          maxLength={1000}
        />
        <p className="text-xs text-slate-500 text-right">
          {formData.energyDrainers?.length || 0} / 1000
        </p>
      </div>

      {/* Relaxing Activity */}
      <div className="space-y-2">
        <Label htmlFor="relaxingActivity">
          Relaxing Activity Used <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="relaxingActivity"
          value={formData.relaxingActivity}
          onChange={(e) => setFormData({ ...formData, relaxingActivity: e.target.value })}
          placeholder="Strategies or activities that helped you relax or regulate..."
          rows={2}
          maxLength={1000}
        />
        <p className="text-xs text-slate-500 text-right">
          {formData.relaxingActivity?.length || 0} / 1000
        </p>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">
          Additional Notes <span className="text-slate-400">(Optional)</span>
        </Label>
        <Textarea
          id="additionalNotes"
          value={formData.additionalNotes}
          onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
          placeholder="Any other thoughts or observations..."
          rows={3}
          maxLength={2000}
        />
        <p className="text-xs text-slate-500 text-right">
          {formData.additionalNotes?.length || 0} / 2000
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>
          Tags <span className="text-slate-400">(Optional, max 20)</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
            maxLength={50}
          />
          <Button type="button" onClick={addTag} variant="outline" size="icon">
            <Plus className="size-4" />
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
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
          Save Journal Entry
        </Button>
      </div>
    </form>
  );
}
