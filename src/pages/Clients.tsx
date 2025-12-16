import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ClientAvatar } from '../components/client/ClientAvatar';
import { TherapyBadge } from '../components/badges/TherapyBadge';
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
import type { TherapistResponse, ParentResponse } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { FormDialog, AddClientForm, type AddClientFormData } from '../components/forms';
import { calculateAge } from '../lib/utils';

export function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'my' | 'all' | null>(null); // null = not initialized
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [picklistsLoading, setPicklistsLoading] = useState(false);
  const [therapists, setTherapists] = useState<TherapistResponse[]>([]);
  const [parents, setParents] = useState<ParentResponse[]>([]);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const { user } = useAuth();

  // Check if user is admin (check both admin flag and role)
  const isAdmin = user?.admin === true;

  // Access control:
  // - Admins default to "all" and can toggle
  // - Non-admins are forced to "my"
  useEffect(() => {
    if (viewMode === null) {
      // Initialize viewMode based on user role
      setViewMode(isAdmin ? 'all' : 'my');
    } else if (!isAdmin && viewMode !== 'my') {
      // Force non-admins to 'my'
      setViewMode('my');
    }
  }, [isAdmin, viewMode]);

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
        // Admins can toggle mine vs all; non-admins always see only their own
        mine: isAdmin ? (viewMode === 'my') : false,
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
    // Don't fetch until viewMode is initialized
    if (viewMode !== null) {
      fetchClients();
    }
  }, [debouncedSearchQuery, statusFilter, viewMode, currentPage]);

  const openAddClient = async () => {
    setIsAddDialogOpen(true);
    try {
      setPicklistsLoading(true);
      const api = getApiClient();
      const [therapistsData, parentsData] = await Promise.all([
        api.adminTherapists.list({ size: 100 }),
        api.adminParents.list7({ size: 100 }),
      ]);
      setTherapists(therapistsData.items || []);
      setParents(parentsData.items || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load therapists/parents');
      setTherapists([]);
      setParents([]);
    } finally {
      setPicklistsLoading(false);
    }
  };

  const handleCreateClient = async (data: AddClientFormData) => {
    if (isCreatingClient) return;
    setIsCreatingClient(true);
    try {
      if (!data.dateOfBirth || !data.therapyStartDate) {
        toast.error('Date of birth and therapy start date are required');
        return;
      }
      if (!data.therapyTypes || data.therapyTypes.length === 0) {
        toast.error('Please select at least one therapy type');
        return;
      }

      const api = getApiClient();

      const clientResponse = await api.adminClients.createClient({
        requestBody: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
          age: calculateAge(data.dateOfBirth),
          photoUrl: data.photoUrl || undefined,
          therapyStartDate: data.therapyStartDate.toISOString().split('T')[0],
          therapies: data.therapyTypes.map((t): 'ABA' | 'Speech' | 'OT' => {
            if (t === 'aba') return 'ABA';
            if (t === 'speech') return 'Speech';
            if (t === 'ot') return 'OT';
            return 'ABA';
          }),
          status: data.status as any,
          sensoryProfile:
            data.visual || data.auditory || data.tactile || data.vestibular || data.proprioceptive
              ? {
                  ...(data.visual && { visual: data.visual }),
                  ...(data.auditory && { auditory: data.auditory }),
                  ...(data.tactile && { tactile: data.tactile }),
                  ...(data.vestibular && { vestibular: data.vestibular }),
                  ...(data.proprioceptive && { proprioceptive: data.proprioceptive }),
                }
              : undefined,
          preferences: data.preferences
            ? data.preferences.split(',').map((p) => p.trim()).filter(Boolean)
            : undefined,
          dislikes: data.dislikes ? data.dislikes.split(',').map((d) => d.trim()).filter(Boolean) : undefined,
          notes: data.communicationStyles || undefined,
        },
      });

      const clientId = clientResponse.id;
      if (!clientId) throw new Error('Client ID not returned from API');

      if (data.therapistId) {
        try {
          await api.adminClientTherapists.assign({
            clientId,
            requestBody: { therapistId: data.therapistId, primary: true },
          });
        } catch (err) {
          console.error(err);
          toast.warning('Client created but therapist assignment failed');
        }
      }

      if (data.parentAction !== 'skip') {
        try {
          if (data.parentAction === 'existing' && data.existingParentId) {
            await api.adminClientParents.create4({
              clientId,
              requestBody: {
                parentId: data.existingParentId,
                relationship: 'Parent',
                primary: data.isPrimaryParent,
              },
            });
          } else if (data.parentAction === 'new') {
            await api.adminClientParents.create4({
              clientId,
              requestBody: {
                fullName: data.newParentFullName,
                email: data.newParentEmail || undefined,
                phone: data.newParentPhone || undefined,
                relationship: data.newParentRelationship,
                primary: data.isPrimaryParent,
              },
            });
          }
        } catch (err) {
          console.error(err);
          toast.warning('Client created but parent assignment failed');
        }
      }

      toast.success('Client created successfully!');
      setIsAddDialogOpen(false);
      setCurrentPage(0);
      await fetchClients();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to create client');
    } finally {
      setIsCreatingClient(false);
    }
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
      // Only admins can toggle viewMode
      if (isAdmin) {
        setViewMode(value as 'my' | 'all');
      }
    }
    setCurrentPage(0); // Reset to first page when filters change
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Clients</h1>
        <Button 
          className="gap-2 bg-teal-600 hover:bg-teal-700"
          onClick={openAddClient}
        >
          <Plus className="size-4" />
          New Client
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {isAdmin && (
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
                        <span key={`${client.id}-therapy-${idx}`}>
                          <TherapyBadge type={therapyType} showLabel={false} />
                        </span>
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

      <FormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add Client"
        description="Multi-step onboarding"
        maxWidth="3xl"
        children={
          picklistsLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading therapists and parents…</p>
            </div>
          ) : (
            <AddClientForm
              therapists={therapists}
              parents={parents}
              isSubmitting={isCreatingClient}
              onCancel={() => setIsAddDialogOpen(false)}
              onSubmit={handleCreateClient}
            />
          )
        }
      />
    </div>
  );
}