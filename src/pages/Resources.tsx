import { useState } from 'react';
import { resources, currentUser } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Plus, FileText, Video, Link as LinkIcon, File, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const typeIcons = {
  pdf: FileText,
  video: Video,
  article: LinkIcon,
  worksheet: File,
  link: ExternalLink,
};

export function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  let filteredResources = resources;

  if (searchQuery) {
    filteredResources = filteredResources.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (typeFilter !== 'all') {
    filteredResources = filteredResources.filter(r => r.type === typeFilter);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Resource Library</h1>
        {currentUser.role === 'admin' && (
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
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
          <CardTitle>{filteredResources.length} Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No resources found</p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map(resource => {
                const Icon = typeIcons[resource.type];

                return (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-teal-100">
                          <Icon className="size-5 text-teal-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{resource.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="text-xs text-slate-500">
                        {resource.category && (
                          <p>Category: {resource.category}</p>
                        )}
                        {resource.fileSize && (
                          <p>{resource.fileSize}</p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <ExternalLink className="size-4" />
                          Open
                        </Button>
                        {currentUser.role === 'admin' && (
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
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
    </div>
  );
}
