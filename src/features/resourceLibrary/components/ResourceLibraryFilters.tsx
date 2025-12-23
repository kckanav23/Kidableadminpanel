import { Search } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { ResourceTypeFilter } from '@/features/resourceLibrary/types';
import { isResourceTypeFilter } from '@/features/resourceLibrary/utils/mappers';

export function ResourceLibraryFilters({
  searchQuery,
  onSearchQueryChange,
  typeFilter,
  onTypeFilterChange,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  typeFilter: ResourceTypeFilter;
  onTypeFilterChange: (value: ResourceTypeFilter) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(v: string) => {
              if (isResourceTypeFilter(v)) onTypeFilterChange(v);
            }}
          >
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
  );
}


