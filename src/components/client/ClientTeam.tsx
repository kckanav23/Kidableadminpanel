import { Client } from '../../types';
import { users, parents } from '../../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Edit, X, UserCog, Users } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { THERAPY_LABELS } from '../../lib/constants';

interface ClientTeamProps {
  client: Client;
}

export function ClientTeam({ client }: ClientTeamProps) {
  // Get all therapists assigned to this client
  const assignedTherapists = users.filter(u => 
    u.role === 'therapist' && (
      u.id === client.primaryTherapistId || 
      // In a real app, we'd have a many-to-many relationship
      false
    )
  );

  // Get all parents for this client
  const clientParents = parents.filter(p => p.childrenIds.includes(client.id));

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

        <div className="space-y-3">
          {assignedTherapists.map(therapist => {
            const isPrimary = therapist.id === client.primaryTherapistId;

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
                          <p className="font-medium">{therapist.name}</p>
                          {isPrimary && (
                            <Badge variant="default" className="bg-teal-600">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          Specializations: {therapist.specializations?.map(s => THERAPY_LABELS[s]).join(', ')}
                        </p>
                        <p className="text-sm text-slate-600">
                          Assigned: {formatDate(client.therapyStartDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!isPrimary && (
                        <Button variant="outline" size="sm">
                          Set as Primary
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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

        <div className="space-y-3">
          {clientParents.map(parent => {
            const isPrimary = parent.id === client.primaryCaregiverId;

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
                          <p className="font-medium">{parent.name}</p>
                          {isPrimary && (
                            <Badge variant="default" className="bg-teal-600">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{parent.relationship}</p>
                        <div className="space-y-1 text-sm text-slate-600">
                          <p className="flex items-center gap-2">
                            <span>📧</span>
                            {parent.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <span>📱</span>
                            {parent.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="size-4" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
