import { useMemo, useState } from 'react';
import { Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useResourceLibrary } from '@/features/clients/tabs/resources/hooks/useResourceLibrary';
import type { ResourceLibraryResponse } from '@/types/api';

type ResourceTypeFilter = 'all' | 'pdf' | 'video' | 'article' | 'worksheet' | 'link';

function isResourceTypeFilter(value: string): value is ResourceTypeFilter {
  return value === 'all' || value === 'pdf' || value === 'video' || value === 'article' || value === 'worksheet' || value === 'link';
}

export function AssignResourceDialog({
  onAssign,
  onCancel,
  isSubmitting,
  assignedResourceIds,
}: {
  onAssign: (payload: { resourceId: string; sharedDate?: string; notes?: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  assignedResourceIds: string[];
}) {
  const [q, setQ] = useState('');
  const [type, setType] = useState<ResourceTypeFilter>('all');
  const [sharedDate, setSharedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const libraryQuery = useResourceLibrary({ q, type });
  const resources = libraryQuery.data?.items || [];
  const assignedIdSet = useMemo(() => new Set(assignedResourceIds), [assignedResourceIds]);

  // Only allow assigning resources that are:
  // - not global (global resources are implicitly assigned)
  // - not already assigned to this client
  const assignableResources = useMemo(
    () => resources.filter((r) => !!r.id && !r.global && !assignedIdSet.has(r.id)),
    [assignedIdSet, resources]
  );

  const assign = (r: ResourceLibraryResponse) => {
    if (!r.id) return;
    onAssign({ resourceId: r.id, sharedDate: sharedDate || undefined, notes: notes || undefined });
  };

  const showEmpty = !libraryQuery.isLoading && assignableResources.length === 0;

  const header = useMemo(() => {
    if (libraryQuery.isLoading) return 'Searching…';
    if (showEmpty) return 'No resources found';
    return `${assignableResources.length} results`;
  }, [assignableResources.length, libraryQuery.isLoading, showEmpty]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sharedDate">Shared Date</Label>
          <Input id="sharedDate" type="date" value={sharedDate} onChange={(e) => setSharedDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(v: string) => {
              if (isResourceTypeFilter(v)) setType(v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="worksheet">Worksheet</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add a short note for the family…" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search library</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input id="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resources…" className="pl-10" />
        </div>
      </div>

      <div className="text-sm text-slate-600">{header}</div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {libraryQuery.isLoading ? (
          <div className="py-10 text-center">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading resources…</p>
          </div>
        ) : showEmpty ? (
          <div className="py-10 text-center text-slate-600">No assignable resources match your search.</div>
        ) : (
          assignableResources.map((r) => (
            <Card key={r.id}>
              <CardContent className="py-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{r.title}</p>
                    {r.type ? <Badge variant="outline">{String(r.type)}</Badge> : null}
                  </div>
                  {r.description ? <p className="text-sm text-slate-600 line-clamp-2 mt-1">{r.description}</p> : null}
                </div>
                <Button size="sm" className="bg-[#0B5B45] hover:bg-[#0D6953]" onClick={() => assign(r)} disabled={isSubmitting || !r.id}>
                  Assign
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}


