import React, { useMemo, useState } from 'react';
import type { ClientProfile as ClientProfileType } from '@/types/api';
import { Plus, Edit, X, UserCog, Users, Loader2, CircleMinus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FormDialog } from '@/components/common/FormDialog';
import { formatDate } from '@/lib/utils';

import { TeamTherapistAssignForm, type TeamTherapistAssignData } from '@/features/clients/tabs/team/components/TeamTherapistAssignForm';
import { TeamParentForm, type TeamParentData } from '@/features/clients/tabs/team/components/TeamParentForm';
import { TeamParentEditForm, type TeamParentEditData } from '@/features/clients/tabs/team/components/TeamParentEditForm';

import { useClientParents } from '@/features/clients/tabs/team/hooks/useClientParents';
import { useClientTherapists } from '@/features/clients/tabs/team/hooks/useClientTherapists';
import { useTherapistPicklist, useParentPicklist } from '@/features/clients/tabs/team/hooks/useTeamPicklists';
import { useAssignTherapist } from '@/features/clients/tabs/team/hooks/useAssignTherapist';
import { useUnassignTherapist } from '@/features/clients/tabs/team/hooks/useUnassignTherapist';
import { useAddParent } from '@/features/clients/tabs/team/hooks/useAddParent';
import { useUpdateParent } from '@/features/clients/tabs/team/hooks/useUpdateParent';
import { useRemoveParent } from '@/features/clients/tabs/team/hooks/useRemoveParent';

export function TeamTab({ client }: { client: ClientProfileType }) {
  const clientId = client.id;

  const therapistsQuery = useClientTherapists(clientId);
  const parentsQuery = useClientParents(clientId);

  const therapists = therapistsQuery.data || [];
  const parents = parentsQuery.data || [];
  const loading = therapistsQuery.isLoading || parentsQuery.isLoading;

  // Keep UI stable even if the backend returns therapists in different orders after mutations.
  // (Avoids the list appearing to "reverse" on primary toggle.)
  const therapistsOrdered = useMemo(() => {
    return [...therapists].sort((a, b) => {
      const aName = (a.therapistName || '').toLowerCase();
      const bName = (b.therapistName || '').toLowerCase();
      if (aName !== bName) return aName.localeCompare(bName);
      return (a.therapistId || '').localeCompare(b.therapistId || '');
    });
  }, [therapists]);

  const [isAddTherapistOpen, setIsAddTherapistOpen] = useState(false);
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [isEditParentOpen, setIsEditParentOpen] = useState(false);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);

  const editingParent = parents.find((p) => p.parentId === editingParentId) || null;

  const assignedTherapistIds = useMemo(
    () => new Set(therapists.map((t) => t.therapistId).filter(Boolean) as string[]),
    [therapists]
  );
  const assignedParentIds = useMemo(() => new Set(parents.map((p) => p.parentId).filter(Boolean) as string[]), [parents]);

  const therapistPicklist = useTherapistPicklist({ clientId, enabled: isAddTherapistOpen });
  const parentPicklist = useParentPicklist({ clientId, enabled: isAddParentOpen });

  const assignTherapist = useAssignTherapist(clientId);
  const unassignTherapist = useUnassignTherapist(clientId);

  const addParent = useAddParent(clientId);
  const updateParent = useUpdateParent(clientId);
  const removeParent = useRemoveParent(clientId);

  const isSubmitting =
    assignTherapist.isPending || unassignTherapist.isPending || addParent.isPending || updateParent.isPending || removeParent.isPending;

  const submitAddTherapist = async (data: TeamTherapistAssignData) => {
    await assignTherapist.mutateAsync({ therapistId: data.therapistId, primary: data.primary, action: 'assign' });
    setIsAddTherapistOpen(false);
  };

  const setTherapistPrimary = async (therapistId: string) => {
    await assignTherapist.mutateAsync({ therapistId, primary: true, action: 'set_primary' });
  };

  const removeTherapistPrimary = async (therapistId: string) => {
    await assignTherapist.mutateAsync({ therapistId, primary: false, action: 'unset_primary' });
  };

  const submitAddParent = async (data: TeamParentData) => {
    const result = await addParent.mutateAsync(
      data.mode === 'existing'
        ? { mode: 'existing', parentId: data.parentId!, relationship: data.relationship, primary: data.primary }
        : {
            mode: 'new',
            fullName: data.fullName!,
            email: data.email,
            phone: data.phone,
            relationship: data.relationship,
            primary: data.primary,
          }
    );

    if (result.accessCode) {
      try {
        await navigator.clipboard.writeText(result.accessCode);
      } catch {
        toast.message('Access code generated (copy failed)', { description: result.accessCode });
      }
    }

    setIsAddParentOpen(false);
  };

  const openEditParent = (parentId: string) => {
    setEditingParentId(parentId);
    setIsEditParentOpen(true);
  };

  const submitEditParent = async (data: TeamParentEditData) => {
    if (!editingParent?.parentId) return;
    await updateParent.mutateAsync({ parentId: editingParent.parentId, requestBody: data });
    setIsEditParentOpen(false);
    setEditingParentId(null);
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
          <Button variant="outline" className="gap-2" onClick={() => setIsAddTherapistOpen(true)}>
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
            {therapistsOrdered.map((therapist, idx) => {
              const isPrimary = therapist.primary || false;

              return (
                <Card key={therapist.therapistId || therapist.id || `therapist-${idx}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center size-12 rounded-full bg-teal-100 text-teal-700">
                          <span className="text-lg">👩‍⚕️</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{therapist.therapistName || 'Unknown'}</p>
                            {isPrimary ? <Badge variant="default" className="bg-teal-600">Primary</Badge> : null}
                          </div>
                          {therapist.assignedAt ? (
                            <p className="text-sm text-slate-600">Assigned: {formatDate(new Date(therapist.assignedAt))}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!isPrimary ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => therapist.therapistId && setTherapistPrimary(therapist.therapistId)}
                            disabled={!therapist.therapistId || isSubmitting}
                          >
                            Set as Primary
                          </Button>
                        ) : therapist.therapistId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-slate-600 border-slate-200 hover:bg-slate-50"
                            onClick={() => removeTherapistPrimary(therapist.therapistId!)}
                            disabled={isSubmitting}
                          >
                            <CircleMinus className="size-4 mr-2" />
                            Remove Primary
                          </Button>
                        ) : null}
                        {therapist.therapistId ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unassignTherapist.mutate(therapist.therapistId!)}
                            disabled={isSubmitting}
                          >
                            <X className="size-4" />
                          </Button>
                        ) : null}
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
          <Button variant="outline" className="gap-2" onClick={() => setIsAddParentOpen(true)}>
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
            {parents.map((parent) => {
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
                            {isPrimary ? <Badge variant="default" className="bg-teal-600">Primary</Badge> : null}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{parent.relationship}</p>
                          <div className="space-y-1 text-sm text-slate-600">
                            {parent.email ? (
                              <p className="flex items-center gap-2">
                                <span>📧</span>
                                {parent.email}
                              </p>
                            ) : null}
                            {parent.phone ? (
                              <p className="flex items-center gap-2">
                                <span>📱</span>
                                {parent.phone}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => parent.parentId && openEditParent(parent.parentId)}
                          disabled={!parent.parentId || isSubmitting}
                        >
                          <Edit className="size-4" />
                          Edit
                        </Button>
                        {parent.parentId ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParent.mutate(parent.parentId!)}
                            disabled={isSubmitting}
                          >
                            <X className="size-4" />
                          </Button>
                        ) : null}
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
      >
        {therapistPicklist.isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading therapists…</p>
          </div>
        ) : (
          <TeamTherapistAssignForm
            therapists={therapistPicklist.data || []}
            assignedTherapistIds={assignedTherapistIds}
            isSubmitting={isSubmitting}
            onCancel={() => setIsAddTherapistOpen(false)}
            onSubmit={submitAddTherapist}
          />
        )}
      </FormDialog>

      <FormDialog
        open={isAddParentOpen}
        onOpenChange={setIsAddParentOpen}
        title="Add Parent"
        description="Link an existing parent or create a new one."
        maxWidth="lg"
      >
        {parentPicklist.isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading parents…</p>
          </div>
        ) : (
          <TeamParentForm
            parents={parentPicklist.data || []}
            assignedParentIds={assignedParentIds}
            isSubmitting={isSubmitting}
            onCancel={() => setIsAddParentOpen(false)}
            onSubmit={submitAddParent}
          />
        )}
      </FormDialog>

      <FormDialog
        open={isEditParentOpen}
        onOpenChange={(open) => {
          setIsEditParentOpen(open);
          if (!open) setEditingParentId(null);
        }}
        title="Edit Parent"
        description="Update parent contact details and relationship."
        maxWidth="lg"
      >
        {!editingParent ? (
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
        )}
      </FormDialog>
    </div>
  );
}


