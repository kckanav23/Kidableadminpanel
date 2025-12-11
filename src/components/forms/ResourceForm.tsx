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
import { CalendarIcon, FileText, Video, Link as LinkIcon, FileSpreadsheet, File } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { Switch } from '../ui/switch';

interface ResourceFormProps {
  onSubmit: (data: ResourceFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ResourceFormData>;
  mode?: 'create' | 'share';
  clientId?: string;
}

export interface ResourceFormData {
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'article' | 'worksheet' | 'link';
  category?: string;
  fileUrl?: string;
  isGlobal?: boolean;
  sharedDate?: string;
  notes?: string;
}

const resourceTypes = [
  { value: 'pdf', label: 'PDF Document', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'article', label: 'Article/Web Page', icon: LinkIcon },
  { value: 'worksheet', label: 'Worksheet', icon: FileSpreadsheet },
  { value: 'link', label: 'External Link', icon: LinkIcon },
];

const categoryOptions = [
  'Behavior Management',
  'Communication',
  'Social Skills',
  'Daily Living',
  'Sensory',
  'Parent Education',
  'Activities',
  'Assessment Tools',
  'General Education',
  'Other',
];

export function ResourceForm({
  onSubmit,
  onCancel,
  initialData,
  mode = 'create',
  clientId,
}: ResourceFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'pdf',
    category: initialData?.category || '',
    fileUrl: initialData?.fileUrl || '',
    isGlobal: initialData?.isGlobal ?? true,
    sharedDate: initialData?.sharedDate,
    notes: initialData?.notes || '',
  });

  const [sharedDateOpen, setSharedDateOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a resource title');
      return;
    }

    if (!formData.type) {
      toast.error('Please select a resource type');
      return;
    }

    if (!formData.fileUrl?.trim()) {
      toast.error('Please provide a file URL or link');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.fileUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    onSubmit(formData);
    toast.success(mode === 'share' ? 'Resource shared successfully' : 'Resource saved successfully');
  };

  const selectedType = resourceTypes.find(t => t.value === formData.type);
  const TypeIcon = selectedType?.icon || File;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Resource Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Visual Schedule Template"
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
          placeholder="Brief overview of this resource and how to use it..."
          rows={3}
        />
      </div>

      {/* Type & Category */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Resource Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resourceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
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

      {/* File URL */}
      <div className="space-y-2">
        <Label htmlFor="fileUrl">
          {formData.type === 'link' || formData.type === 'article' ? 'URL' : 'File URL'} *
        </Label>
        <div className="flex gap-2">
          <TypeIcon className="size-4 text-slate-400 mt-3 shrink-0" />
          <Input
            id="fileUrl"
            type="url"
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            placeholder={
              formData.type === 'video'
                ? 'https://youtube.com/watch?v=...'
                : formData.type === 'link' || formData.type === 'article'
                ? 'https://...'
                : 'https://example.com/file.pdf'
            }
            required
          />
        </div>
        <p className="text-xs text-slate-500">
          {formData.type === 'pdf' && 'Upload the PDF to cloud storage and paste the shareable link here'}
          {formData.type === 'video' && 'Paste a YouTube, Vimeo, or other video link'}
          {(formData.type === 'link' || formData.type === 'article') && 'Paste the web page URL'}
          {formData.type === 'worksheet' && 'Upload the worksheet and paste the shareable link'}
        </p>
      </div>

      {/* Share Date (if sharing with client) */}
      {mode === 'share' && clientId && (
        <div className="space-y-2">
          <Label htmlFor="sharedDate">
            Share Date <span className="text-slate-400">(Optional, defaults to today)</span>
          </Label>
          <Popover open={sharedDateOpen} onOpenChange={setSharedDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left',
                  !formData.sharedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.sharedDate ? formatDate(new Date(formData.sharedDate)) : 'Today'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.sharedDate ? new Date(formData.sharedDate) : new Date()}
                onSelect={(date) => {
                  if (date) {
                    setFormData({ ...formData, sharedDate: date.toISOString().split('T')[0] });
                    setSharedDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Notes (for sharing with client) */}
      {mode === 'share' && clientId && (
        <div className="space-y-2">
          <Label htmlFor="notes">
            Notes for Client/Parents <span className="text-slate-400">(Optional)</span>
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Special instructions or context for this family..."
            rows={3}
          />
        </div>
      )}

      {/* Global Resource Toggle (only in create mode) */}
      {mode === 'create' && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <Label htmlFor="isGlobal">Global Resource</Label>
            <p className="text-sm text-slate-600 mt-1">
              Make this resource available in the library for all staff
            </p>
          </div>
          <Switch
            id="isGlobal"
            checked={formData.isGlobal}
            onCheckedChange={(checked) => setFormData({ ...formData, isGlobal: checked })}
          />
        </div>
      )}

      {/* Helpful Tips */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-medium">Tip:</span> For best results, upload files to Google Drive, Dropbox, or similar cloud storage and use shareable links. Make sure the link permissions allow viewing.
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
          {mode === 'share' ? 'Share Resource' : initialData ? 'Update Resource' : 'Create Resource'}
        </Button>
      </div>
    </form>
  );
}
