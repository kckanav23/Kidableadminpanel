import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormDialog } from '@/components/common';
import { useAuth } from '@/features/auth';
import { ClientCard } from '@/features/clients/components/ClientCard';
import { ClientFilters } from '@/features/clients/components/ClientFilters';
import { ClientForm } from '@/features/clients/components/ClientForm';
import type { ClientFormData } from '@/features/clients/clientForm';
import { useClientPicklists } from '@/features/clients/hooks/useClientPicklists';
import { useClients } from '@/features/clients/hooks/useClients';
import { useCreateClient } from '@/features/clients/hooks/useCreateClient';

export function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'my' | 'all' | null>(null); // null = not initialized
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { user } = useAuth();

  // Access control:
  // - Admins default to "all" and can toggle
  // - Non-admins are forced to "my"
  const isAdmin = user?.admin === true;
  useEffect(() => {
    if (viewMode === null) {
      setViewMode(isAdmin ? 'all' : 'my');
    } else if (!isAdmin && viewMode !== 'my') {
      setViewMode('my');
    }
  }, [isAdmin, viewMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const effectiveViewMode: 'my' | 'all' = useMemo(() => (viewMode === null ? (isAdmin ? 'all' : 'my') : viewMode), [isAdmin, viewMode]);

  const clientsQuery = useClients({
    q: debouncedSearchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    mine: isAdmin ? effectiveViewMode === 'my' : false,
    page: currentPage,
    size: 20,
  });

  const clients = clientsQuery.data?.items || [];
  const totalPages = clientsQuery.data?.totalPages || 1;
  const total = clientsQuery.data?.total || 0;
  const loading = clientsQuery.isLoading || clientsQuery.isFetching;

  const picklistsQuery = useClientPicklists({ enabled: isAddDialogOpen });
  const createClient = useCreateClient();

  const openAddClient = () => setIsAddDialogOpen(true);

  const handleCreateClient = async (data: ClientFormData) => {
    await createClient.mutateAsync(data);
    setIsAddDialogOpen(false);
    setCurrentPage(0);
    await clientsQuery.refetch();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (type: 'status' | 'viewMode', value: string) => {
    if (type === 'status') {
      setStatusFilter(value);
    } else {
      if (isAdmin) setViewMode(value as 'my' | 'all');
    }
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Clients</h1>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={openAddClient}>
          <Plus className="size-4" />
          New Client
        </Button>
      </div>

      <ClientFilters
        isAdmin={isAdmin}
        viewMode={effectiveViewMode}
        onViewModeChange={(mode) => handleFilterChange('viewMode', mode)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => handleFilterChange('status', value)}
      />

      <Card>
        <CardHeader>
          <CardTitle>{total} Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No clients found</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
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
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </Button>
              <p className="text-sm text-slate-600">
                Page {currentPage + 1} of {totalPages} • {total} total clients
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Next
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <FormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add Client"
        description="Multi-step onboarding"
        maxWidth="3xl"
        children={
          picklistsQuery.isLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading therapists and parents…</p>
            </div>
          ) : (
            <ClientForm
              therapists={picklistsQuery.data?.therapists || []}
              parents={picklistsQuery.data?.parents || []}
              isSubmitting={createClient.isPending}
              onCancel={() => setIsAddDialogOpen(false)}
              onSubmit={handleCreateClient}
              submitLabel="Create Client"
            />
          )
        }
      />
    </div>
  );
}


