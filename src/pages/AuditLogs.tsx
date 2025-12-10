import { useState } from 'react';
import { auditLogs } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
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
};

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<string>('all');

  let filteredLogs = auditLogs;

  if (searchQuery) {
    filteredLogs = filteredLogs.filter(log =>
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (resourceFilter !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.resourceType === resourceFilter);
  }

  const sortedLogs = [...filteredLogs].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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
          <CardTitle>{sortedLogs.length} Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No audit logs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLogs.map(log => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={actionColors[log.action] || 'text-slate-600 border-slate-300'}
                      >
                        {log.action}
                      </Badge>
                      <Badge variant="secondary">{log.resourceType}</Badge>
                    </div>
                    <p className="text-sm mb-1">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{log.userName}</span>
                      <span>•</span>
                      <span>{formatDateTime(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
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
