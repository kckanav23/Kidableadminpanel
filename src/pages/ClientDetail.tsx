import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clients, parents, users, goals, sessions, homework, strategies, resources, journalEntries } from '../lib/mockData';
import { formatDate } from '../lib/utils';
import { ClientAvatar } from '../components/ClientAvatar';
import { TherapyBadge } from '../components/TherapyBadge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { ClientProfile } from '../components/client/ClientProfile';
import { ClientGoals } from '../components/client/ClientGoals';
import { ClientSessions } from '../components/client/ClientSessions';
import { ClientHomework } from '../components/client/ClientHomework';
import { ClientResources } from '../components/client/ClientResources';
import { ClientStrategies } from '../components/client/ClientStrategies';
import { ClientMoodJournal } from '../components/client/ClientMoodJournal';
import { ClientTeam } from '../components/client/ClientTeam';

export function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState('profile');

  const client = clients.find(c => c.id === clientId);
  const primaryTherapist = users.find(u => u.id === client?.primaryTherapistId);
  const primaryCaregiver = parents.find(p => p.id === client?.primaryCaregiverId);

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Client not found</p>
        <Link to="/clients">
          <Button variant="outline" className="mt-4">Back to Clients</Button>
        </Link>
      </div>
    );
  }

  const fullName = `${client.firstName} ${client.lastName}`;
  const sinceDate = formatDate(client.therapyStartDate);
  const dobDate = formatDate(client.dateOfBirth);

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
                {client.age} years old • Born {dobDate} • Since {sinceDate}
              </p>
              <div className="flex items-center gap-2">
                {client.therapyTypes.map(type => (
                  <TherapyBadge key={type} type={type} />
                ))}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-5" />
          </Button>
        </div>

        <div className="grid gap-2 text-sm">
          <div>
            <span className="text-slate-600">Primary Therapist: </span>
            <span className="font-medium">{primaryTherapist?.name}</span>
          </div>
          <div>
            <span className="text-slate-600">Primary Caregiver: </span>
            <span className="font-medium">
              {primaryCaregiver?.name} ({primaryCaregiver?.relationship})
            </span>
          </div>
        </div>
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
          <ClientGoals
            clientId={client.id}
            goals={goals.filter(g => g.clientId === client.id)}
          />
        </TabsContent>

        <TabsContent value="sessions" className="mt-0">
          <ClientSessions
            clientId={client.id}
            sessions={sessions.filter(s => s.clientId === client.id)}
          />
        </TabsContent>

        <TabsContent value="homework" className="mt-0">
          <ClientHomework
            clientId={client.id}
            homework={homework.filter(h => h.clientId === client.id)}
          />
        </TabsContent>

        <TabsContent value="resources" className="mt-0">
          <ClientResources clientId={client.id} />
        </TabsContent>

        <TabsContent value="strategies" className="mt-0">
          <ClientStrategies clientId={client.id} />
        </TabsContent>

        <TabsContent value="mood" className="mt-0">
          <ClientMoodJournal
            clientId={client.id}
            entries={journalEntries.filter(j => j.clientId === client.id)}
          />
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <ClientTeam client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
