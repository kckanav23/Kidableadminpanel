import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, FileText, Video, Link as LinkIcon, File, ExternalLink, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { getApiClient } from '../../lib/api-client';
import type { ResourceResponse } from '../../types/api';
import { toast } from 'sonner';

interface ClientResourcesProps {
  clientId: string;
}

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

export function ClientResources({ clientId }: ClientResourcesProps) {
  const [resources, setResources] = useState<ResourceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminClientResources.getResources1({ clientId });
        setResources(response);
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load resources');
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [clientId]);

  const handleUnassign = async (resourceId: string) => {
    try {
      const api = getApiClient();
      await api.adminClientResources.unassign2({
        clientId,
        resourceId,
      });

      // Refresh resources list
      const updated = await api.adminClientResources.getResources1({ clientId });
      setResources(updated);

      toast.success('Resource unassigned successfully');
    } catch (error) {
      console.error('Error unassigning resource:', error);
      toast.error('Failed to unassign resource');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{resources.length} Resources</h2>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          Assign Resource
        </Button>
      </div>

      {/* Resources List */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading resources...</p>
          </CardContent>
        </Card>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No resources assigned yet</p>
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Assign First Resource
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resources.map(resource => {
            const resourceType = resource.type?.toLowerCase() || 'link';
            const Icon = typeIcons[resourceType as keyof typeof typeIcons] || ExternalLink;

            return (
              <Card key={resource.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="size-5 text-slate-600" />
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      <p className="text-sm text-slate-600">{resource.description}</p>
                    </div>
                    <Badge variant="secondary">{typeLabels[resourceType as keyof typeof typeLabels] || 'Resource'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    {resource.sharedDate && (
                      <p>
                        <span className="text-slate-600">Shared: </span>
                        {formatDate(new Date(resource.sharedDate))}
                        {resource.uploadedByUser && ` by ${resource.uploadedByUser.name}`}
                      </p>
                    )}
                    {resource.notes && (
                      <p className="mt-1">
                        <span className="text-slate-600">Note: </span>
                        "{resource.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {resource.fileUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => window.open(resource.fileUrl, '_blank')}
                      >
                        <ExternalLink className="size-4" />
                        Open Resource
                      </Button>
                    )}
                    {resource.id && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleUnassign(resource.id!)}
                      >
                        Unassign
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}