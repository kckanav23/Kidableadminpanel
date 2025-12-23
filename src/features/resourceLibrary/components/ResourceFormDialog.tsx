import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { ResourceLibraryResponse } from '@/types/api';
import type { ResourceFormData } from '@/features/resourceLibrary/types';

function emptyForm(globalDefault: boolean): ResourceFormData {
  return {
    title: '',
    description: '',
    type: 'link',
    category: '',
    fileUrl: '',
    fileSize: '',
    global: globalDefault,
  };
}

export function ResourceFormDialog({
  mode,
  open,
  onOpenChange,
  isSubmitting,
  initialResource,
  onSubmit,
  globalDefault,
}: {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  initialResource: ResourceLibraryResponse | null;
  onSubmit: (data: ResourceFormData) => Promise<void> | void;
  globalDefault: boolean;
}) {
  const [formData, setFormData] = useState<ResourceFormData>(() => emptyForm(globalDefault));

  const title = mode === 'create' ? 'Add Resource' : 'Edit Resource';
  const description = mode === 'create' ? 'Create a new resource in the library' : 'Update resource information';
  const submitLabel = mode === 'create' ? 'Create Resource' : 'Update Resource';

  const canSubmit = useMemo(() => !!formData.title.trim() && !isSubmitting, [formData.title, isSubmitting]);

  useEffect(() => {
    if (!open) return;

    if (mode === 'create') {
      setFormData(emptyForm(globalDefault));
      return;
    }

    if (!initialResource) return;
    setFormData({
      title: initialResource.title || '',
      description: initialResource.description || '',
      type: (initialResource.type as any) || 'link',
      category: initialResource.category || '',
      fileUrl: initialResource.fileUrl || '',
      fileSize: initialResource.fileSize ? String(initialResource.fileSize) : '',
      global: initialResource.global ?? globalDefault,
    });
  }, [globalDefault, initialResource, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              placeholder="Resource title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'description' : 'edit-description'}>Description</Label>
            <Textarea
              id={mode === 'create' ? 'description' : 'edit-description'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Resource description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'type' : 'edit-type'}>Type *</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="worksheet">Worksheet</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'category' : 'edit-category'}>Category</Label>
            <Input
              id={mode === 'create' ? 'category' : 'edit-category'}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Communication, Behavior, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'fileUrl' : 'edit-fileUrl'}>File URL</Label>
            <Input
              id={mode === 'create' ? 'fileUrl' : 'edit-fileUrl'}
              type="url"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              placeholder="https://example.com/resource.pdf"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={mode === 'create' ? 'fileSize' : 'edit-fileSize'}>File Size (bytes)</Label>
            <Input
              id={mode === 'create' ? 'fileSize' : 'edit-fileSize'}
              type="number"
              value={formData.fileSize}
              onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
              placeholder="e.g., 1024000"
            />
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
              Make this a global resource
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


