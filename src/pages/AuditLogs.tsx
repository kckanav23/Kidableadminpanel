import React, { useState, useEffect } from 'react';
import { getApiClient, handleApiError } from '../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { toast } from 'sonner';
import type { AuditLogResponse } from '../types/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

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

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch audit logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminAuditLog.list7({
          resourceType: resourceFilter !== 'all' ? resourceFilter : undefined,
          size: 100, // Get a reasonable number of logs
        });
        
        let fetchedLogs = response.items || [];
        
        // Client-side search filtering (since API doesn't support search)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          fetchedLogs = fetchedLogs.filter(log =>
            log.performedBy?.toLowerCase().includes(query) ||
            log.action?.toLowerCase().includes(query) ||
            JSON.stringify(log.details || {}).toLowerCase().includes(query)
          );
        }
        
        // Sort by creation date (newest first)
        fetchedLogs.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        setLogs(fetchedLogs);
      } catch (error) {
        handleApiError(error);
        toast.error('Failed to load audit logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search - wait 300ms after user stops typing
    const timeoutId = setTimeout(() => {
      fetchLogs();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, resourceFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Audit Logs</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search by user or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Session">Session</SelectItem>
                <SelectItem value="Goal">Goal</SelectItem>
                <SelectItem value="Homework">Homework</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>{logs.length} Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading audit logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                {searchQuery || resourceFilter !== 'all'
                  ? 'No audit logs found matching your filters'
                  : 'No audit logs found'}
              </p>
              {(searchQuery || resourceFilter !== 'all') && (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setResourceFilter('all'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map(log => {
                // Format details for display
                const detailsText = log.details 
                  ? typeof log.details === 'string' 
                    ? log.details 
                    : JSON.stringify(log.details)
                  : log.outcome || 'No details available';

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={actionColors[log.action || ''] || 'text-slate-600 border-slate-300'}
                        >
                          {log.action || 'Unknown'}
                        </Badge>
                        {log.resourceType && (
                          <Badge variant="secondary">{log.resourceType}</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-1">{detailsText}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {log.performedBy && <span>{log.performedBy}</span>}
                        {log.performedBy && log.createdAt && <span>•</span>}
                        {log.createdAt && (
                          <span>{formatDateTime(new Date(log.createdAt))}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-2xl">📋</div>
            <div className="text-sm">
              <p className="font-medium text-slate-900 mb-1">About Audit Logs</p>
              <p className="text-slate-700">
                Audit logs track all significant actions taken in the system for accountability and
                compliance purposes. Logs are retained for regulatory requirements and can be used
                to review historical changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
