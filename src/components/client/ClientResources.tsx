import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, FileText, Video, Link as LinkIcon, File, ExternalLink } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface ClientResourcesProps {
  clientId: string;
}

// Mock assigned resources for this client
const assignedResources = [
  {
    id: 'r1',
    title: 'Sensory Processing Guide',
    description: 'A comprehensive guide to understanding sensory processing',
    type: 'pdf' as const,
    sharedDate: new Date('2025-12-01'),
    sharedBy: 'Dr. Sarah Chen',
    note: 'Please review before our next session',
    fileSize: '2.4 MB',
  },
  {
    id: 'r2',
    title: 'Visual Schedule Templates',
    description: 'Printable templates for creating visual schedules at home',
    type: 'worksheet' as const,
    sharedDate: new Date('2025-11-15'),
    sharedBy: 'Anna Martinez',
    note: '',
  },
];

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{assignedResources.length} Resources</h2>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          Assign Resource
        </Button>
      </div>

      {/* Resources List */}
      {assignedResources.length === 0 ? (
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
          {assignedResources.map(resource => {
            const Icon = typeIcons[resource.type];

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
                    <Badge variant="secondary">{typeLabels[resource.type]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p>
                      <span className="text-slate-600">Shared: </span>
                      {formatDate(resource.sharedDate)} by {resource.sharedBy}
                    </p>
                    {resource.note && (
                      <p className="mt-1">
                        <span className="text-slate-600">Note: </span>
                        "{resource.note}"
                      </p>
                    )}
                    {resource.fileSize && (
                      <p className="mt-1 text-slate-500">{resource.fileSize}</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="size-4" />
                      Open Resource
                    </Button>
                    <Button variant="ghost" size="sm">
                      Unassign
                    </Button>
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