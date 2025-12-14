import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ClientAvatar } from '../components/client/ClientAvatar';
import { TherapyBadge } from '../components/badges/TherapyBadge';
import { AddClientDialog } from '../components/dialogs/AddClientDialog';
import { Search, ArrowRight, Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { getApiClient, handleApiError } from '../lib/api-client';
import type { ClientSummary } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { user } = useAuth();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(0); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch clients from API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const api = getApiClient();
      const response = await api.adminClients.listClients({
        q: debouncedSearchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        mine: viewMode === 'my',
        page: currentPage,
        size: 20,
      });
      
      setClients(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients. Please try again.');
      setClients([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [debouncedSearchQuery, statusFilter, viewMode, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (type: 'status' | 'viewMode', value: string) => {
    if (type === 'status') {
      setStatusFilter(value);
    } else {
      setViewMode(value as 'my' | 'all');
    }
    setCurrentPage(0); // Reset to first page when filters change
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Clients</h1>
        <Button 
          className="gap-2 bg-teal-600 hover:bg-teal-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="size-4" />
          New Client
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {user && !user.admin && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'my' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('viewMode', 'my')}
                  className={viewMode === 'my' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  My Clients
                </Button>
                <Button
                  variant={viewMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('viewMode', 'all')}
                  className={viewMode === 'all' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  All Clients
                </Button>
              </div>
            )}

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
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
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <ClientAvatar
                    name={`${client.firstName} ${client.lastName}`}
                    photoUrl={client.photoUrl}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{client.firstName} {client.lastName}</p>
                    <p className="text-sm text-slate-600">{client.age} years old</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {client.therapies.map((therapy, idx) => {
                      const therapyType = therapy.toLowerCase() as 'aba' | 'speech' | 'ot';
                      return (
                        <TherapyBadge key={`${client.id}-therapy-${idx}`} type={therapyType} showLabel={false} />
                      );
                    })}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      client.status === 'active'
                        ? 'text-green-700 border-green-700'
                        : client.status === 'suspended'
                        ? 'text-red-700 border-red-700'
                        : 'text-slate-600 border-slate-300'
                    }
                  >
                    {client.status}
                  </Badge>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
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

      {/* Add Client Dialog */}
      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          // Refresh the client list
          setCurrentPage(0);
          fetchClients();
        }}
      />
    </div>
  );
}