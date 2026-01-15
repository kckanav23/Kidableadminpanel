import { ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { ResourceLibraryResponse } from '@/types/api';
import { formatFileSize } from '@/features/resourceLibrary/utils/mappers';

export function ResourceViewDialog({
  open,
  onOpenChange,
  resource,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: ResourceLibraryResponse | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{resource?.title || 'Resource Details'}</DialogTitle>
          <DialogDescription>View complete resource information</DialogDescription>
        </DialogHeader>
        {resource ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-600">Type</Label>
              <Badge variant="secondary" className="mt-1 capitalize">
                {resource.type || 'link'}
              </Badge>
            </div>
            {resource.description ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Description</Label>
                <p className="mt-1 text-sm">{resource.description}</p>
              </div>
            ) : null}
            {resource.category ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Category</Label>
                <p className="mt-1 text-sm">{resource.category}</p>
              </div>
            ) : null}
            {resource.fileUrl ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">File URL</Label>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-blue-600 break-all">{resource.fileUrl}</p>
                  <Button variant="outline" size="sm" onClick={() => window.open(resource.fileUrl, '_blank')}>
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}
            {resource.fileSize ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">File Size</Label>
                <p className="mt-1 text-sm">{formatFileSize(resource.fileSize)}</p>
              </div>
            ) : null}
            {resource.uploadedBy ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Uploaded By</Label>
                <p className="mt-1 text-sm">{resource.uploadedBy}</p>
              </div>
            ) : null}
            {resource.createdAt ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Created</Label>
                <p className="mt-1 text-sm">{new Date(resource.createdAt).toLocaleString()}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


