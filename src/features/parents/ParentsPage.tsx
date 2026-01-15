import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useCreateParentAccessCode } from '@/features/parents/hooks/useCreateParentAccessCode';
import { useDeleteParent } from '@/features/parents/hooks/useDeleteParent';
import { useParentAccessCodes } from '@/features/parents/hooks/useParentAccessCodes';
import { useParents } from '@/features/parents/hooks/useParents';
import { useRevokeParentAccessCode } from '@/features/parents/hooks/useRevokeParentAccessCode';
import { formatDate } from '@/lib/utils';
import { ChevronDown, ChevronUp, Copy, Key, Loader2, Mail, Phone, Plus, Search, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ParentResponse } from '@/types/api';

export function ParentsPage() {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ parentId: string; name: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useParents({ q: debouncedSearchQuery, size: 100 });
  const parents: ParentResponse[] = useMemo(() => data?.items || [], [data?.items]);

  const accessCodesQuery = useParentAccessCodes(
    { parentId: expandedParentId || '', active: true },
    { enabled: Boolean(expandedParentId) }
  );

  const createAccessCode = useCreateParentAccessCode();
  const revokeAccessCode = useRevokeParentAccessCode();
  const deleteParent = useDeleteParent();

  const handleToggleExpand = (parentId: string) => {
    setExpandedParentId((prev) => (prev === parentId ? null : parentId));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Access code copied to clipboard');
  };

  const handleCreateAccessCode = async (parentId: string) => {
    const newCode = await createAccessCode.mutateAsync({ parentId, requestBody: {} });
    if (newCode.code) {
      navigator.clipboard.writeText(newCode.code);
      toast.info('Access code copied to clipboard');
    }
  };

  const handleRevokeAccessCode = async (parentId: string, accessCodeId: string) => {
    if (!confirm('Are you sure you want to revoke this access code? It will no longer be usable.')) return;
    await revokeAccessCode.mutateAsync({ parentId, accessCodeId });
  };

  const handleConfirmDeleteParent = async () => {
    if (!deleteTarget?.parentId) return;
    await deleteParent.mutateAsync(deleteTarget.parentId);
    if (expandedParentId === deleteTarget.parentId) setExpandedParentId(null);
    setDeleteTarget(null);
  };

  const expandedCodes = expandedParentId ? accessCodesQuery.data || [] : [];
  const isLoadingCodes = accessCodesQuery.isLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Parent Directory</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{parents.length} Parents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading parents...</span>
            </div>
          ) : parents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">{searchQuery ? 'No parents found matching your search' : 'No parents found'}</p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {parents.map((parent) => {
                const parentId = parent.id || '';
                const isExpanded = expandedParentId === parentId;
                const parentCodes = isExpanded ? expandedCodes : [];

                return (
                  <Card key={parentId} className="hover:shadow-sm transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-700">
                          <span className="text-lg">👤</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{parent.fullName || 'Unknown'}</h3>
                            <Badge
                              variant="outline"
                              className={
                                parent.status === 'active' ? 'text-green-700 border-green-700' : 'text-slate-600 border-slate-300'
                              }
                            >
                              {parent.status || 'unknown'}
                            </Badge>
                          </div>


                          <div className="space-y-1 text-sm text-slate-600">
                            {parent.email && (
                              <p className="flex items-center gap-2">
                                <Mail className="size-4" />
                                {parent.email}
                              </p>
                            )}
                            {parent.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="size-4" />
                                {parent.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleToggleExpand(parentId)}
                            disabled={!parentId}
                          >
                            <Key className="size-4" />
                            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                          </Button>
                          {user?.admin ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeleteTarget({ parentId, name: parent.fullName || 'this parent' })}
                              disabled={!parentId || deleteParent.isPending}
                              aria-label="Delete parent"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-sm">Access Codes</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreateAccessCode(parentId)}
                              disabled={createAccessCode.isPending || !parentId}
                            >
                              <Plus className="size-4 mr-1" />
                              Generate Code
                            </Button>
                          </div>

                          {isLoadingCodes ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="size-4 animate-spin text-[#0B5B45]" />
                              <span className="ml-2 text-sm text-slate-600">Loading codes...</span>
                            </div>
                          ) : parentCodes.length === 0 ? (
                            <div className="text-center py-4 text-sm text-slate-500">No access codes found. Generate one to get started.</div>
                          ) : (
                            <div className="space-y-2">
                              {parentCodes.map((code) => (
                                <div
                                  key={code.id}
                                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <code className="font-mono text-sm font-medium">{code.code || 'N/A'}</code>
                                      {code.active ? (
                                        <Badge variant="outline" className="text-green-700 border-green-700 text-xs">
                                          Active
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-red-700 border-red-700 text-xs">
                                          Inactive
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-500 space-y-1">
                                      {code.createdAt && <p>Created: {formatDate(new Date(code.createdAt))}</p>}
                                      {code.lastUsed && <p>Last used: {formatDate(new Date(code.lastUsed))}</p>}
                                      {code.clientId && <p>Client specific</p>}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    {code.code && (
                                      <Button variant="outline" size="sm" onClick={() => handleCopyCode(code.code!)}>
                                        <Copy className="size-4" />
                                      </Button>
                                    )}
                                    {code.active && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRevokeAccessCode(parentId, code.id || '')}
                                        disabled={revokeAccessCode.isPending || !code.id}
                                      >
                                        <X className="size-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete parent is admin-only */}
      {user?.admin ? (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => {
            if (!open && !deleteParent.isPending) setDeleteTarget(null);
          }}
          title="Delete parent?"
          description={
            deleteTarget
              ? `This will permanently delete ${deleteTarget.name}. This action cannot be undone.`
              : 'This action cannot be undone.'
          }
          confirmLabel={deleteParent.isPending ? 'Deleting…' : 'Delete'}
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={handleConfirmDeleteParent}
        />
      ) : null}
    </div>
  );
}


