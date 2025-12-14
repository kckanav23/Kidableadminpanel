import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiClient, handleApiError } from '../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Search, Plus, FileText, Video, Link as LinkIcon, File, ExternalLink, Loader2, 
  Edit, Trash2, X 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import type { ResourceLibraryResponse } from '../types/api';

const typeIcons = {
  pdf: FileText,
  video: Video,
  article: LinkIcon,
  worksheet: File,
  link: ExternalLink,
};

interface ResourceFormData {
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'worksheet' | 'link';
  category: string;
  fileUrl: string;
  fileSize: string;
  global: boolean;
}

export function Resources() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [resources, setResources] = useState<ResourceLibraryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingResource, setViewingResource] = useState<ResourceLibraryResponse | null>(null);
  const [editingResource, setEditingResource] = useState<ResourceLibraryResponse | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    type: 'link',
    category: '',
    fileUrl: '',
    fileSize: '',
    global: true,
  });

  // Fetch resources from API
  const fetchResources = async () => {
    setLoading(true);
    try {
      const api = getApiClient();
      const response = await api.adminResourceLibrary.list3({
        q: searchQuery || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        size: 100,
      });
      setResources(response.items || []);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to load resources');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResources();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, typeFilter]);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      type: 'link',
      category: '',
      fileUrl: '',
      fileSize: '',
      global: true,
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (resource: ResourceLibraryResponse) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || '',
      description: resource.description || '',
      type: (resource.type as any) || 'link',
      category: resource.category || '',
      fileUrl: resource.fileUrl || '',
      fileSize: resource.fileSize ? String(resource.fileSize) : '',
      global: resource.global ?? true,
    });
    setIsEditOpen(true);
  };

  const handleOpenView = (resource: ResourceLibraryResponse) => {
    setViewingResource(resource);
    setIsViewOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const api = getApiClient();
      const response = await api.adminResourceLibrary.create3({
        requestBody: {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          category: formData.category || undefined,
          fileUrl: formData.fileUrl || undefined,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
          global: formData.global,
        },
      });
      
      toast.success('Resource created successfully');
      setIsAddOpen(false);
      
      // Use the response to add the new resource immediately, then refetch to get uploadedBy
      if (response) {
        setResources(prev => [response, ...prev]);
      }
      
      // Refetch to ensure we have all fields including uploadedBy
      await fetchResources();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to create resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    if (!editingResource?.id) return;
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const api = getApiClient();
      await api.adminResourceLibrary.update3({
        resourceId: editingResource.id,
        requestBody: {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          category: formData.category || undefined,
          fileUrl: formData.fileUrl || undefined,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
          global: formData.global,
        },
      });
      toast.success('Resource updated successfully');
      setIsEditOpen(false);
      setEditingResource(null);
      await fetchResources();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to update resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (resource: ResourceLibraryResponse) => {
    if (!resource.id) return;
    if (!confirm(`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const api = getApiClient();
      await api.adminResourceLibrary.delete2({ resourceId: resource.id });
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete resource');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Resource Library</h1>
        {user?.admin && (
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={handleOpenAdd}>
            <Plus className="size-4" />
            Upload Resource
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="worksheet">Worksheet</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
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
              <p className="text-slate-600 mb-4">
                {searchQuery || typeFilter !== 'all' 
                  ? 'No resources found matching your filters' 
                  : 'No resources found'}
              </p>
              {(searchQuery || typeFilter !== 'all') && (
              <Button variant="outline" onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}>
                Clear Filters
              </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map(resource => {
                const Icon = typeIcons[resource.type || 'link'];

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
                      {resource.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {resource.description}
                      </p>
                      )}

                      <div className="text-xs text-slate-500">
                        {resource.category && (
                          <p>Category: {resource.category}</p>
                        )}
                        {resource.fileSize && (
                          <p>{formatFileSize(resource.fileSize)}</p>
                        )}
                        {resource.uploadedBy && (
                          <p>Uploaded by: {resource.uploadedBy}</p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-2"
                          onClick={() => handleOpenView(resource)}
                        >
                          <ExternalLink className="size-4" />
                          View
                        </Button>
                        {user?.admin && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenEdit(resource)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(resource)}
                            >
                              <Trash2 className="size-4" />
                          </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingResource?.title || 'Resource Details'}</DialogTitle>
            <DialogDescription>View complete resource information</DialogDescription>
          </DialogHeader>
          {viewingResource && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-600">Type</Label>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {viewingResource.type || 'link'}
                </Badge>
              </div>
              {viewingResource.description && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Description</Label>
                  <p className="mt-1 text-sm">{viewingResource.description}</p>
                </div>
              )}
              {viewingResource.category && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Category</Label>
                  <p className="mt-1 text-sm">{viewingResource.category}</p>
                </div>
              )}
              {viewingResource.fileUrl && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">File URL</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm text-blue-600 break-all">{viewingResource.fileUrl}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(viewingResource.fileUrl, '_blank')}
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
              {viewingResource.fileSize && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">File Size</Label>
                  <p className="mt-1 text-sm">{formatFileSize(viewingResource.fileSize)}</p>
                </div>
              )}
              {viewingResource.uploadedBy && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Uploaded By</Label>
                  <p className="mt-1 text-sm">{viewingResource.uploadedBy}</p>
                </div>
              )}
              {viewingResource.createdAt && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Created</Label>
                  <p className="mt-1 text-sm">{new Date(viewingResource.createdAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>Create a new resource in the library</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Resource description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
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
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Communication, Behavior, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL</Label>
              <Input
                id="fileUrl"
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://example.com/resource.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileSize">File Size (bytes)</Label>
              <Input
                id="fileSize"
                type="number"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="e.g., 1024000"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="global"
                checked={formData.global}
                onChange={(e) => setFormData({ ...formData, global: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="global" className="font-normal cursor-pointer">
                Make this a global resource
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Create Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update resource information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Resource description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
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
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Communication, Behavior, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fileUrl">File URL</Label>
              <Input
                id="edit-fileUrl"
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://example.com/resource.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fileSize">File Size (bytes)</Label>
              <Input
                id="edit-fileSize"
                type="number"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="e.g., 1024000"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-global"
                checked={formData.global}
                onChange={(e) => setFormData({ ...formData, global: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-global" className="font-normal cursor-pointer">
                Make this a global resource
              </Label>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Resource'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
