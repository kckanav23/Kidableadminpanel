import { useEffect, useMemo, useState } from 'react';
import { Edit, ExternalLink, File, FileText, Loader2, Plus, Trash2, Video, Link as LinkIcon } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import type { ResourceLibraryResponse } from '@/types/api';
import type { ResourceFormData, ResourceTypeFilter } from '@/features/resourceLibrary/types';
import { ResourceLibraryFilters } from '@/features/resourceLibrary/components/ResourceLibraryFilters';
import { ResourceViewDialog } from '@/features/resourceLibrary/components/ResourceViewDialog';
import { ResourceFormDialog } from '@/features/resourceLibrary/components/ResourceFormDialog';
import { useResourceLibraryList } from '@/features/resourceLibrary/hooks/useResourceLibraryList';
import { useCreateResource } from '@/features/resourceLibrary/hooks/useCreateResource';
import { useUpdateResource } from '@/features/resourceLibrary/hooks/useUpdateResource';
import { useDeleteResource } from '@/features/resourceLibrary/hooks/useDeleteResource';
import { buildCreateRequest, buildUpdateRequest, formatFileSize } from '@/features/resourceLibrary/utils/mappers';

const typeIcons = {
  pdf: FileText,
  video: Video,
  article: LinkIcon,
  worksheet: File,
  link: ExternalLink,
};

export function ResourceLibraryPage() {
  useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResourceTypeFilter>('all');

  const [viewingResource, setViewingResource] = useState<ResourceLibraryResponse | null>(null);
  const [editingResource, setEditingResource] = useState<ResourceLibraryResponse | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Match existing behavior: debounce only when user types something.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, searchQuery ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const listQuery = useResourceLibraryList({
    q: debouncedSearchQuery.trim() ? debouncedSearchQuery.trim() : undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    size: 100,
  });

  const resources = listQuery.data?.items || [];
  const loading = listQuery.isLoading || listQuery.isFetching;

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();
  const isSubmitting = createResource.isPending || updateResource.isPending || deleteResource.isPending;

  const handleOpenAdd = () => setIsAddOpen(true);

  const handleOpenEdit = (resource: ResourceLibraryResponse) => {
    setEditingResource(resource);
    setIsEditOpen(true);
  };

  const handleOpenView = (resource: ResourceLibraryResponse) => {
    setViewingResource(resource);
    setIsViewOpen(true);
  };

  const handleSubmitAdd = async (data: ResourceFormData) => {
    if (!data.title.trim()) {
      toast.error('Title is required');
      return;
    }
    await createResource.mutateAsync(buildCreateRequest(data));
    setIsAddOpen(false);
  };

  const handleSubmitEdit = async (data: ResourceFormData) => {
    if (!editingResource?.id) return;
    if (!data.title.trim()) {
      toast.error('Title is required');
      return;
    }
    await updateResource.mutateAsync({ resourceId: editingResource.id, requestBody: buildUpdateRequest(data) });
    setIsEditOpen(false);
    setEditingResource(null);
  };

  const handleDelete = async (resource: ResourceLibraryResponse) => {
    if (!resource.id) return;
    if (!confirm(`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`)) return;
    await deleteResource.mutateAsync(resource.id);
  };

  const emptyMessage = useMemo(() => {
    if (searchQuery || typeFilter !== 'all') return 'No resources found matching your filters';
    return 'No resources found';
  }, [searchQuery, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Resource Library</h1>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={handleOpenAdd}>
          <Plus className="size-4" />
          Upload Resource
        </Button>
      </div>

      <ResourceLibraryFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle>{resources.length} Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading resources...</span>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">{emptyMessage}</p>
              {(searchQuery || typeFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => {
                const Icon = typeIcons[(resource.type || 'link') as keyof typeof typeIcons] || ExternalLink;

                return (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-teal-100">
                          <Icon className="size-5 text-teal-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{resource.title || 'Untitled'}</CardTitle>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {resource.type || 'link'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {resource.description ? <p className="text-sm text-slate-600 line-clamp-2">{resource.description}</p> : null}

                      <div className="text-xs text-slate-500">
                        {resource.category ? <p>Category: {resource.category}</p> : null}
                        {resource.fileSize ? <p>{formatFileSize(resource.fileSize)}</p> : null}
                        {resource.uploadedBy ? <p>Uploaded by: {resource.uploadedBy}</p> : null}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleOpenView(resource)}
                          disabled={isSubmitting}
                        >
                          <ExternalLink className="size-4" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(resource)} disabled={isSubmitting}>
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(resource)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ResourceViewDialog open={isViewOpen} onOpenChange={setIsViewOpen} resource={viewingResource} />

      <ResourceFormDialog
        mode="create"
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        isSubmitting={isSubmitting}
        initialResource={null}
        onSubmit={handleSubmitAdd}
        globalDefault={true}
      />

      <ResourceFormDialog
        mode="edit"
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditingResource(null);
        }}
        isSubmitting={isSubmitting}
        initialResource={editingResource}
        onSubmit={handleSubmitEdit}
        globalDefault={true}
      />
    </div>
  );
}


