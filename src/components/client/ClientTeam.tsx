import React, { useState, useEffect } from 'react';
import type { ClientProfile as ClientProfileType } from '../../types/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Edit, X, UserCog, Users, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { THERAPY_LABELS } from '../../lib/constants';
import { getApiClient } from '../../lib/api-client';
import type { ClientTherapistResponse, ClientParentResponse } from '../../types/api';
import { toast } from 'sonner';

interface ClientTeamProps {
  client: ClientProfileType;
}

export function ClientTeam({ client }: ClientTeamProps) {
  const [therapists, setTherapists] = useState<ClientTherapistResponse[]>([]);
  const [parents, setParents] = useState<ClientParentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch therapists and parents from API
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const [therapistsData, parentsData] = await Promise.all([
          api.adminClientTherapists.list4({ clientId: client.id }),
          api.adminClientParents.list5({ clientId: client.id }),
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

  return (
    <div className="space-y-6">
      {/* Assigned Therapists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center gap-2">
            <UserCog className="size-5" />
            Assigned Therapists
          </h2>
          <Button variant="outline" className="gap-2">
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
                        <Button variant="outline" size="sm">
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
                              const updated = await api.adminClientTherapists.list4({ clientId: client.id });
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
          <Button variant="outline" className="gap-2">
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
                      <Button variant="outline" size="sm" className="gap-2">
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
                              const updated = await api.adminClientParents.list5({ clientId: client.id });
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
    </div>
  );
}
