import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

import { AuditLogFilters } from '@/features/auditLogs/components/AuditLogFilters';
import { useAuditLogs } from '@/features/auditLogs/hooks/useAuditLogs';

const actionColors: Record<string, string> = {
  Created: 'text-green-700 border-green-700',
  Updated: 'text-blue-700 border-blue-700',
  Deleted: 'text-red-700 border-red-700',
  Assigned: 'text-purple-700 border-purple-700',
  created: 'text-green-700 border-green-700',
  updated: 'text-blue-700 border-blue-700',
  deleted: 'text-red-700 border-red-700',
  assigned: 'text-purple-700 border-purple-700',
};

export function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages

  // keep same UX as the old page: debounce the local search string
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearchQuery(searchQuery), searchQuery ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Reset pagination when filters/search change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchQuery, resourceFilter]);

  const pageSize = 50;

  const logsQuery = useAuditLogs({
    resourceType: resourceFilter !== 'all' ? resourceFilter : undefined,
    page: currentPage,
    size: pageSize,
    q: debouncedSearchQuery.trim() ? debouncedSearchQuery.trim() : undefined,
  });

  const logs = logsQuery.data?.items || [];
  const total = logsQuery.data?.total ?? logs.length;
  const totalPages = logsQuery.data?.totalPages ?? 1;
  const loading = logsQuery.isLoading || logsQuery.isFetching;

  const emptyMessage = useMemo(() => {
    if (searchQuery || resourceFilter !== 'all') return 'No audit logs found matching your filters';
    return 'No audit logs found';
  }, [resourceFilter, searchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0) return;
    if (newPage >= totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Audit Logs</h1>
      </div>

      <AuditLogFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        resourceFilter={resourceFilter}
        onResourceFilterChange={setResourceFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle>{total} Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading audit logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">{emptyMessage}</p>
              {(searchQuery || resourceFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setResourceFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const detailsText = log.details
                  ? typeof log.details === 'string'
                    ? log.details
                    : JSON.stringify(log.details)
                  : log.outcome || 'No details available';

                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={actionColors[log.action || ''] || 'text-slate-600 border-slate-300'}>
                          {log.action || 'Unknown'}
                        </Badge>
                        {log.resourceType ? <Badge variant="secondary">{log.resourceType}</Badge> : null}
                      </div>
                      <p className="text-sm mb-1">{detailsText}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {log.performedBy ? <span>{log.performedBy}</span> : null}
                        {log.performedBy && log.createdAt ? <span>•</span> : null}
                        {log.createdAt ? <span>{formatDateTime(new Date(log.createdAt))}</span> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        {totalPages > 1 && (
          <CardContent className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
              >
                Previous
              </Button>
              <p className="text-sm text-slate-600">
                Page {currentPage + 1} of {totalPages} • {total} total logs
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Next
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-2xl">📋</div>
            <div className="text-sm">
              <p className="font-medium text-slate-900 mb-1">About Audit Logs</p>
              <p className="text-slate-700">
                Audit logs track all significant actions taken in the system for accountability and compliance purposes. Logs are retained for
                regulatory requirements and can be used to review historical changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


