import { useMemo, useState } from 'react';
import { ExternalLink, File, FileText, Loader2, Plus, Video, Link as LinkIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormDialog } from '@/components/common/FormDialog';

import type { ResourceAssignToClientRequest } from '@/types/api';
import { useClientResources } from '@/features/clients/tabs/resources/hooks/useClientResources';
import { useAssignClientResource } from '@/features/clients/tabs/resources/hooks/useAssignClientResource';
import { useUnassignClientResource } from '@/features/clients/tabs/resources/hooks/useUnassignClientResource';
import { AssignResourceDialog } from '@/features/clients/tabs/resources/components/AssignResourceDialog';

const typeIcons = {
  pdf: FileText,
  video: Video,
  article: LinkIcon,
  worksheet: File,
  link: ExternalLink,
};

const typeLabels = {
  pdf: 'PDF',
  video: 'Video',
  article: 'Article',
  worksheet: 'Worksheet',
  link: 'Link',
};

export function ResourcesTab({ clientId }: { clientId: string }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'assigned' | 'all'>('assigned');

  const resourcesQuery = useClientResources(clientId, viewMode);
  const resources = resourcesQuery.data || [];

  const assign = useAssignClientResource(clientId);
  const unassign = useUnassignClientResource(clientId);
  const isSubmitting = assign.isPending || unassign.isPending;

  const assignedResourceIds = useMemo(() => resources.filter((r) => !!r.id && !r.global).map((r) => r.id!) as string[], [resources]);

  // Backend supports `scope=assigned|all`, but we keep a defensive UI filter so the toggle always behaves:
  // - "assigned" shows only explicitly assigned (non-global) resources
  // - "all" shows assigned + global
  const displayResources = useMemo(() => {
    if (viewMode === 'all') return resources;
    return resources.filter((r) => !r.global);
  }, [resources, viewMode]);

  const countLabel = useMemo(() => `${displayResources.length} Resources`, [displayResources.length]);

  const submitAssign = async (payload: { resourceId: string; sharedDate?: string; notes?: string }) => {
    const requestBody: ResourceAssignToClientRequest = {
      resourceId: payload.resourceId,
      sharedDate: payload.sharedDate,
      notes: payload.notes,
    };
    await assign.mutateAsync(requestBody);
    setAssignOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl">{countLabel}</h2>
          <Button
            type="button"
            variant={viewMode === 'assigned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('assigned')}
            className={viewMode === 'assigned' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            Assigned only
          </Button>
          <Button type="button" variant={viewMode === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('all')}>
            Show all
          </Button>
        </div>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]" onClick={() => setAssignOpen(true)} disabled={isSubmitting}>
          <Plus className="size-4" />
          Assign Resource
        </Button>
      </div>

      {resourcesQuery.isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading resources...</p>
          </CardContent>
        </Card>
      ) : displayResources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No resources assigned yet</p>
            <Button variant="outline" className="gap-2" onClick={() => setAssignOpen(true)} disabled={isSubmitting}>
              <Plus className="size-4" />
              Assign First Resource
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayResources.map((resource) => {
            const resourceType = resource.type?.toLowerCase() || 'link';
            const Icon = typeIcons[resourceType as keyof typeof typeIcons] || ExternalLink;

            return (
              <Card key={resource.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="size-5 text-slate-600" />
                        <CardTitle className="text-lg">{resource.title || 'Untitled'}</CardTitle>
                      </div>
                      {resource.description ? <p className="text-sm text-slate-600">{resource.description}</p> : null}
                    </div>
                    <Badge variant="secondary">{typeLabels[resourceType as keyof typeof typeLabels] || 'Resource'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    {resource.uploadedBy ? <p className="text-slate-600">Uploaded by {resource.uploadedBy}</p> : null}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {resource.fileUrl ? (
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(resource.fileUrl, '_blank')}>
                        <ExternalLink className="size-4" />
                        Open Resource
                      </Button>
                    ) : null}
                    {resource.id && !resource.global ? (
                      <Button variant="ghost" size="sm" onClick={() => unassign.mutate(resource.id!)} disabled={isSubmitting}>
                        Unassign
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <FormDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        title="Assign Resource"
        description="Pick a resource from the library and share it with this client."
        maxWidth="2xl"
      >
        <AssignResourceDialog
          onAssign={submitAssign}
          onCancel={() => setAssignOpen(false)}
          isSubmitting={isSubmitting}
          assignedResourceIds={assignedResourceIds}
        />
      </FormDialog>
    </div>
  );
}


