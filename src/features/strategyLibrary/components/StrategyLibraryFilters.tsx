import { Search } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { StrategyTypeFilter } from '@/features/strategyLibrary/types';
import { isStrategyTypeFilter } from '@/features/strategyLibrary/utils/mappers';

export function StrategyLibraryFilters({
  searchQuery,
  onSearchQueryChange,
  typeFilter,
  onTypeFilterChange,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  typeFilter: StrategyTypeFilter;
  onTypeFilterChange: (value: StrategyTypeFilter) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(v: string) => {
              if (isStrategyTypeFilter(v)) onTypeFilterChange(v);
            }}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="antecedent">Antecedent</SelectItem>
              <SelectItem value="reinforcement">Reinforcement</SelectItem>
              <SelectItem value="regulation">Regulation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}


