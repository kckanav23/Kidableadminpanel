import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { ClientAvatar } from '../components/client/ClientAvatar';
import { TherapyBadge } from '../components/badges/TherapyBadge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ChevronLeft, MoreVertical, Loader2 } from 'lucide-react';
import { ClientProfile } from '../components/client/ClientProfile';
import { ClientGoals } from '../components/client/ClientGoals';
import { ClientSessions } from '../components/client/ClientSessions';
import { ClientHomework } from '../components/client/ClientHomework';
import { ClientResources } from '../components/client/ClientResources';
import { ClientStrategies } from '../components/client/ClientStrategies';
import { ClientMoodJournal } from '../components/client/ClientMoodJournal';
import { ClientTeam } from '../components/client/ClientTeam';
import { getApiClient, handleApiError } from '../lib/api-client';
import type { ClientProfile as ClientProfileType } from '../types/api';
import { toast } from 'sonner';

export function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState('profile');
  const [client, setClient] = useState<ClientProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client profile from API
  useEffect(() => {
    if (!clientId) return;

    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = getApiClient();
        const response = await api.adminClients.getClient({ clientId });
        setClient(response);
      } catch (err) {
        console.error('Error fetching client:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load client';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
        <p className="text-slate-600 mt-2">Loading client...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">{error || 'Client not found'}</p>
        <Link to="/clients">
          <Button variant="outline" className="mt-4">Back to Clients</Button>
        </Link>
      </div>
    );
  }

  const fullName = `${client.firstName} ${client.lastName}`;
  const dobDate = client.dateOfBirth ? formatDate(new Date(client.dateOfBirth)) : 'N/A';
  
  // Find primary parent from clientParents array
  const primaryParent = client.clientParents?.find(p => p.isPrimary)?.parents;
  const primaryParentName = primaryParent?.fullName || 'Not assigned';
  const primaryParentRelationship = client.clientParents?.find(p => p.isPrimary)?.relationship || '';

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
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-5" />
          </Button>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-lg border overflow-x-auto">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Goals
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Sessions
            </TabsTrigger>
            <TabsTrigger
              value="homework"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Homework
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="strategies"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Strategies
            </TabsTrigger>
            <TabsTrigger
              value="mood"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Mood & Journal
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              Team
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="mt-0">
          <ClientProfile client={client} />
        </TabsContent>

        <TabsContent value="goals" className="mt-0">
          <ClientGoals clientId={client.id} />
        </TabsContent>

        <TabsContent value="sessions" className="mt-0">
          <ClientSessions clientId={client.id} />
        </TabsContent>

        <TabsContent value="homework" className="mt-0">
          <ClientHomework clientId={client.id} />
        </TabsContent>

        <TabsContent value="resources" className="mt-0">
          <ClientResources clientId={client.id} />
        </TabsContent>

        <TabsContent value="strategies" className="mt-0">
          <ClientStrategies clientId={client.id} />
        </TabsContent>

        <TabsContent value="mood" className="mt-0">
          <ClientMoodJournal clientId={client.id} />
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <ClientTeam client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
