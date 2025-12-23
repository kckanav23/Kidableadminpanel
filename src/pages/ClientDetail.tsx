import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2, MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TherapyBadge } from '@/components/badges/TherapyBadge';
import { useAuth } from '@/features/auth';
import { ClientAvatar, ClientDetailTabs, useClient, useDeleteClient } from '@/features/clients';
import { formatDate } from '@/lib/utils';

export function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.admin === true;

  const clientQuery = useClient(clientId);
  const client = clientQuery.data;
  const deleteClient = useDeleteClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (clientQuery.isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
        <p className="text-slate-600 mt-2">Loading client...</p>
      </div>
    );
  }

  if (clientQuery.isError || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">{clientQuery.error instanceof Error ? clientQuery.error.message : 'Client not found'}</p>
        <Link to="/clients">
          <Button variant="outline" className="mt-4">Back to Clients</Button>
        </Link>
      </div>
    );
  }

  const fullName = `${client.firstName} ${client.lastName}`;
  const dobDate = client.dateOfBirth ? formatDate(new Date(client.dateOfBirth)) : 'N/A';
  
  // Relationships may not be reflected in the generated `ClientProfileResponse` type yet.
  // Keep this defensive so the page doesn't break if/when backend shape changes.
  const primaryParentRelation = (client as any)?.clientParents?.find((p: any) => p?.isPrimary);
  const primaryParent = primaryParentRelation?.parents;
  const primaryParentName = primaryParent?.fullName || 'Not assigned';
  const primaryParentRelationship = primaryParentRelation?.relationship || '';

  const handleConfirmDelete = async () => {
    if (!clientId) return;
    await deleteClient.mutateAsync(clientId);
    setIsDeleteOpen(false);
    navigate('/clients');
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link to="/clients" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
        <ChevronLeft className="size-4" />
        Back to Clients
      </Link>

      {/* Client Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <ClientAvatar name={fullName} photoUrl={client.photoUrl} size="lg" />
            <div>
              <h1 className="text-2xl mb-1">{fullName}</h1>
              <p className="text-slate-600 mb-2">
                {client.age ? `${client.age} years old` : ''} • Born {dobDate}
              </p>
              <div className="flex items-center gap-2">
                {client.therapies.map((therapy, idx) => {
                  const therapyType = therapy.toLowerCase() as 'aba' | 'speech' | 'ot';
                  return (
                    <TherapyBadge key={`therapy-${idx}`} type={therapyType} />
                  );
                })}
              </div>
            </div>
          </div>
          {isAdmin ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Client actions">
                    <MoreVertical className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setIsDeleteOpen(true)}>
                    Delete client
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete client?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete <span className="font-medium">{fullName}</span> and remove them from the system. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteClient.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteClient.isPending}>
                        {deleteClient.isPending ? 'Deleting…' : 'Delete'}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
        </div>

        {primaryParent && (
          <div className="grid gap-2 text-sm">
            <div>
              <span className="text-slate-600">Primary Caregiver: </span>
              <span className="font-medium">
                {primaryParentName} {primaryParentRelationship ? `(${primaryParentRelationship})` : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      <ClientDetailTabs client={client as any} />
    </div>
  );
}
