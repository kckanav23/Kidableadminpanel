import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiClient } from '../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Mail, Phone, Loader2, Key, Plus, Copy, X, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { toast } from 'sonner';
import type { ParentResponse, ParentAccessCodeResponse } from '../types/api';

export function Parents() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [parents, setParents] = useState<ParentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [accessCodes, setAccessCodes] = useState<Record<string, ParentAccessCodeResponse[]>>({});
  const [loadingCodes, setLoadingCodes] = useState<Record<string, boolean>>({});

  // Fetch parents from API
  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminParents.list7({
          q: searchQuery || undefined,
          size: 100, // Get all parents for now
        });
        setParents(response.items || []);
      } catch (error) {
        console.error('Error loading parents:', error);
        toast.error('Failed to load parents');
        setParents([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search - wait 300ms after user stops typing
    const timeoutId = setTimeout(() => {
      fetchParents();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch access codes for a parent
  const fetchAccessCodes = async (parentId: string) => {
    if (!parentId) return;
    
    setLoadingCodes(prev => ({ ...prev, [parentId]: true }));
    try {
      const api = getApiClient();
      const codes = await api.adminParentAccessCodes.list4({
        parentId,
        active: true,
      });
      setAccessCodes(prev => ({ ...prev, [parentId]: codes || [] }));
    } catch (error) {
      console.error('Error loading access codes:', error);
      toast.error('Failed to load access codes');
    } finally {
      setLoadingCodes(prev => ({ ...prev, [parentId]: false }));
    }
  };

  const handleToggleExpand = (parentId: string) => {
    if (expandedParent === parentId) {
      setExpandedParent(null);
    } else {
      setExpandedParent(parentId);
      if (!accessCodes[parentId]) {
        fetchAccessCodes(parentId);
      }
    }
  };

  const handleCreateAccessCode = async (parentId: string) => {
    try {
      const api = getApiClient();
      const newCode = await api.adminParentAccessCodes.create4({
        parentId,
        requestBody: {
          // clientId is optional - creates a general access code
        },
      });
      
      toast.success('Access code created successfully');
      if (newCode.code) {
        navigator.clipboard.writeText(newCode.code);
        toast.info('Access code copied to clipboard');
      }
      
      // Refresh access codes
      fetchAccessCodes(parentId);
    } catch (error) {
      console.error('Error creating access code:', error);
      toast.error('Failed to create access code');
    }
  };

  const handleRevokeAccessCode = async (codeId: string, parentId: string) => {
    if (!confirm('Are you sure you want to revoke this access code? It will no longer be usable.')) {
      return;
    }

    try {
      const api = getApiClient();
      await api.adminParentAccessCodes.delete3({ parentId, accessCodeId: codeId });
      toast.success('Access code revoked');
      fetchAccessCodes(parentId);
    } catch (error) {
      console.error('Error revoking access code:', error);
      toast.error('Failed to revoke access code');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Access code copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Parent Directory</h1>
      </div>

      {/* Search */}
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

      {/* Parents List */}
      <Card>
        <CardHeader>
          <CardTitle>{parents.length} Parents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading parents...</span>
            </div>
          ) : parents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                {searchQuery ? 'No parents found matching your search' : 'No parents found'}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {parents.map(parent => {
                const isExpanded = expandedParent === parent.id;
                const parentCodes = accessCodes[parent.id || ''] || [];
                const isLoadingCodes = loadingCodes[parent.id || ''] || false;

                return (
                  <Card key={parent.id} className="hover:shadow-sm transition-shadow">
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
                                parent.status === 'active'
                                  ? 'text-green-700 border-green-700'
                                  : 'text-slate-600 border-slate-300'
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

                        {user?.admin && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleToggleExpand(parent.id || '')}
                            >
                              <Key className="size-4" />
                              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Access Codes Section */}
                      {isExpanded && user?.admin && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-sm">Access Codes</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreateAccessCode(parent.id || '')}
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
                            <div className="text-center py-4 text-sm text-slate-500">
                              No access codes found. Generate one to get started.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {parentCodes.map(code => (
                                <div
                                  key={code.id}
                                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <code className="font-mono text-sm font-medium">
                                        {code.code || 'N/A'}
                                      </code>
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
                                      {code.createdAt && (
                                        <p>Created: {formatDate(new Date(code.createdAt))}</p>
                                      )}
                                      {code.lastUsed && (
                                        <p>Last used: {formatDate(new Date(code.lastUsed))}</p>
                                      )}
                                      {code.clientId && (
                                        <p>Client specific</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    {code.code && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(code.code!)}
                                      >
                                        <Copy className="size-4" />
                                      </Button>
                                    )}
                                    {code.active && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRevokeAccessCode(code.id || '', parent.id || '')}
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
    </div>
  );
}
