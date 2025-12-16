import React, { useMemo, useState, useEffect } from 'react';
import type { ClientProfile as ClientProfileType } from '../../types/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Edit, X, UserCog, Users, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { getApiClient } from '../../lib/api-client';
import type {
  ClientTherapistResponse,
  ClientParentResponse,
  TherapistResponse,
  ParentResponse,
} from '../../types/api';
import { toast } from 'sonner';
import {
  FormDialog,
  TeamTherapistAssignForm,
  TeamParentForm,
  TeamParentEditForm,
  type TeamTherapistAssignData,
  type TeamParentData,
  type TeamParentEditData,
} from '../forms';

interface ClientTeamProps {
  client: ClientProfileType;
}

export function ClientTeam({ client }: ClientTeamProps) {
  const [therapists, setTherapists] = useState<ClientTherapistResponse[]>([]);
  const [parents, setParents] = useState<ClientParentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddTherapistOpen, setIsAddTherapistOpen] = useState(false);
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [isEditParentOpen, setIsEditParentOpen] = useState(false);

  const [editingParent, setEditingParent] = useState<ClientParentResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [picklistsLoading, setPicklistsLoading] = useState(false);
  const [allTherapists, setAllTherapists] = useState<TherapistResponse[]>([]);
  const [allParents, setAllParents] = useState<ParentResponse[]>([]);

  const assignedTherapistIds = useMemo(
    () => new Set(therapists.map((t) => t.therapistId).filter(Boolean) as string[]),
    [therapists],
  );
  const assignedParentIds = useMemo(
    () => new Set(parents.map((p) => p.parentId).filter(Boolean) as string[]),
    [parents],
  );

  // Fetch therapists and parents from API
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const [therapistsData, parentsData] = await Promise.all([
          api.adminClientTherapists.list5({ clientId: client.id }),
          api.adminClientParents.list6({ clientId: client.id }),
        ]);
        setTherapists(therapistsData);
        setParents(parentsData);
      } catch (error) {
        console.error('Error fetching team:', error);
        toast.error('Failed to load team members');
        setTherapists([]);
        setParents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [client.id]);

  const refreshTeam = async () => {
    try {
      const api = getApiClient();
      const [therapistsData, parentsData] = await Promise.all([
        api.adminClientTherapists.list5({ clientId: client.id }),
        api.adminClientParents.list6({ clientId: client.id }),
      ]);
      setTherapists(therapistsData);
      setParents(parentsData);
    } catch (error) {
      console.error('Error refreshing team:', error);
    }
  };

  const openAddTherapist = async () => {
    setIsAddTherapistOpen(true);
    try {
      setPicklistsLoading(true);
      const api = getApiClient();
      const res = await api.adminTherapists.list({ size: 10 });
      setAllTherapists(res.items || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load therapists');
      setAllTherapists([]);
    } finally {
      setPicklistsLoading(false);
    }
  };

  const submitAddTherapist = async (data: TeamTherapistAssignData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const api = getApiClient();
      await api.adminClientTherapists.assign({
        clientId: client.id,
        requestBody: { therapistId: data.therapistId, primary: data.primary },
      });
      toast.success('Therapist assigned successfully');
      setIsAddTherapistOpen(false);
      await refreshTeam();
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign therapist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setTherapistPrimary = async (therapistId: string) => {
    try {
      const api = getApiClient();
      await api.adminClientTherapists.assign({
        clientId: client.id,
        requestBody: { therapistId, primary: true },
      });
      toast.success('Primary therapist updated');
      await refreshTeam();
    } catch (error) {
      console.error(error);
      toast.error('Failed to set primary therapist');
    }
  };

  const openAddParent = async () => {
    setIsAddParentOpen(true);
    try {
      setPicklistsLoading(true);
      const api = getApiClient();
      const res = await api.adminParents.list7({ size: 10 });
      setAllParents(res.items || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load parents');
      setAllParents([]);
    } finally {
      setPicklistsLoading(false);
    }
  };

  const submitAddParent = async (data: TeamParentData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const api = getApiClient();
      const response = await api.adminClientParents.create5({
        clientId: client.id,
        requestBody:
          data.mode === 'existing'
            ? {
                parentId: data.parentId!,
                relationship: data.relationship,
                primary: data.primary,
              }
            : {
                fullName: data.fullName!,
                email: data.email || undefined,
                phone: data.phone || undefined,
                relationship: data.relationship,
                primary: data.primary,
              },
      });

      // Generate access code for new parent
      if (data.mode === 'new' && response.parentId) {
        try {
          const code = await api.adminParentAccessCodes.create4({
            parentId: response.parentId,
            requestBody: { clientId: client.id },
          });
          if (code.code) {
            navigator.clipboard.writeText(code.code);
            toast.success(`Parent added! Access code copied: ${code.code}`);
          } else {
            toast.success('Parent added successfully');
          }
        } catch {
          toast.success('Parent added (access code generation failed)');
        }
      } else {
        toast.success('Parent added successfully');
      }

      setIsAddParentOpen(false);
      await refreshTeam();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add parent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditParent = (parent: ClientParentResponse) => {
    setEditingParent(parent);
    setIsEditParentOpen(true);
  };

  const submitEditParent = async (data: TeamParentEditData) => {
    if (!editingParent?.parentId) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const api = getApiClient();
      await api.adminClientParents.update({
        clientId: client.id,
        parentId: editingParent.parentId,
        requestBody: data,
      });
      toast.success('Parent updated');
      setIsEditParentOpen(false);
      setEditingParent(null);
      await refreshTeam();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update parent');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Assigned Therapists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center gap-2">
            <UserCog className="size-5" />
            Assigned Therapists
          </h2>
          <Button variant="outline" className="gap-2" onClick={openAddTherapist}>
            <Plus className="size-4" />
            Add Therapist
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading therapists...</p>
            </CardContent>
          </Card>
        ) : therapists.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600">No therapists assigned yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {therapists.map(therapist => {
              const isPrimary = therapist.primary || false;

            return (
              <Card key={therapist.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center size-12 rounded-full bg-teal-100 text-teal-700">
                        <span className="text-lg">👩‍⚕️</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{therapist.therapistName || 'Unknown'}</p>
                          {isPrimary && (
                            <Badge variant="default" className="bg-teal-600">Primary</Badge>
                          )}
                        </div>
                        {therapist.assignedAt && (
                          <p className="text-sm text-slate-600">
                            Assigned: {formatDate(new Date(therapist.assignedAt))}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!isPrimary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => therapist.therapistId && setTherapistPrimary(therapist.therapistId)}
                          disabled={!therapist.therapistId}
                        >
                          Set as Primary
                        </Button>
                      )}
                      {therapist.therapistId && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            try {
                              const api = getApiClient();
                              await api.adminClientTherapists.unassign({
                                clientId: client.id,
                                therapistId: therapist.therapistId!,
                              });
                              toast.success('Therapist removed successfully');
                              // Refresh
                              const updated = await api.adminClientTherapists.list5({ clientId: client.id });
                              setTherapists(updated);
                            } catch (error) {
                              toast.error('Failed to remove therapist');
                            }
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}
      </div>

      {/* Parents/Caregivers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center gap-2">
            <Users className="size-5" />
            Parents/Caregivers
          </h2>
          <Button variant="outline" className="gap-2" onClick={openAddParent}>
            <Plus className="size-4" />
            Add Parent
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading parents...</p>
            </CardContent>
          </Card>
        ) : parents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600">No parents assigned yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {parents.map(parent => {
              const isPrimary = parent.primary || false;

            return (
              <Card key={parent.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-700">
                        <span className="text-lg">👤</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{parent.fullName || 'Unknown'}</p>
                          {isPrimary && (
                            <Badge variant="default" className="bg-teal-600">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{parent.relationship}</p>
                        <div className="space-y-1 text-sm text-slate-600">
                          {parent.email && (
                            <p className="flex items-center gap-2">
                              <span>📧</span>
                              {parent.email}
                            </p>
                          )}
                          {parent.phone && (
                            <p className="flex items-center gap-2">
                              <span>📱</span>
                              {parent.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => openEditParent(parent)}
                      >
                        <Edit className="size-4" />
                        Edit
                      </Button>
                      {parent.parentId && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            try {
                              const api = getApiClient();
                              await api.adminClientParents.delete({
                                clientId: client.id,
                                parentId: parent.parentId!,
                              });
                              toast.success('Parent removed successfully');
                              // Refresh
                              const updated = await api.adminClientParents.list6({ clientId: client.id });
                              setParents(updated);
                            } catch (error) {
                              toast.error('Failed to remove parent');
                            }
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}
      </div>

      <FormDialog
        open={isAddTherapistOpen}
        onOpenChange={setIsAddTherapistOpen}
        title="Add Therapist"
        description="Assign a therapist to this client."
        maxWidth="lg"
        children={
          picklistsLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading therapists…</p>
            </div>
          ) : (
            <TeamTherapistAssignForm
              therapists={allTherapists}
              assignedTherapistIds={assignedTherapistIds}
              isSubmitting={isSubmitting}
              onCancel={() => setIsAddTherapistOpen(false)}
              onSubmit={submitAddTherapist}
            />
          )
        }
      />

      <FormDialog
        open={isAddParentOpen}
        onOpenChange={setIsAddParentOpen}
        title="Add Parent"
        description="Link an existing parent or create a new one."
        maxWidth="lg"
        children={
          picklistsLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading parents…</p>
            </div>
          ) : (
            <TeamParentForm
              parents={allParents}
              assignedParentIds={assignedParentIds}
              isSubmitting={isSubmitting}
              onCancel={() => setIsAddParentOpen(false)}
              onSubmit={submitAddParent}
            />
          )
        }
      />

      <FormDialog
        open={isEditParentOpen}
        onOpenChange={(open) => {
          setIsEditParentOpen(open);
          if (!open) setEditingParent(null);
        }}
        title="Edit Parent"
        description="Update parent contact details and relationship."
        maxWidth="lg"
        children={
          !editingParent ? (
            <div className="py-6 text-sm text-slate-600">No parent selected.</div>
          ) : (
            <TeamParentEditForm
              initialData={{
                fullName: editingParent.fullName,
                email: editingParent.email,
                phone: editingParent.phone,
                relationship: editingParent.relationship || 'Parent',
                primary: !!editingParent.primary,
              }}
              isSubmitting={isSubmitting}
              onCancel={() => setIsEditParentOpen(false)}
              onSubmit={submitEditParent}
            />
          )
        }
      />
    </div>
  );
}
