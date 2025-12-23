import { Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/common/LoadingState';
import { ProfileTab } from '@/features/clients/tabs/profile';
import { GoalsTab } from '@/features/clients/tabs/goals';
import { SessionsTab } from '@/features/clients/tabs/sessions';
import { HomeworkTab } from '@/features/clients/tabs/homework';
import { ResourcesTab } from '@/features/clients/tabs/resources';
import { StrategiesTab } from '@/features/clients/tabs/strategies';
import { MoodJournalTab } from '@/features/clients/tabs/journal';
import { TeamTab } from '@/features/clients/tabs/team';
import type { ClientProfile as ClientProfileType } from '@/types/api';

type TabKey = 'profile' | 'goals' | 'sessions' | 'homework' | 'resources' | 'strategies' | 'mood' | 'team';

const TAB_ORDER: Array<{ key: TabKey; label: string }> = [
  { key: 'profile', label: 'Profile' },
  { key: 'goals', label: 'Goals' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'homework', label: 'Homework' },
  { key: 'resources', label: 'Resources' },
  { key: 'strategies', label: 'Strategies' },
  { key: 'mood', label: 'Mood & Journal' },
  { key: 'team', label: 'Team' },
];

function getTabFromSearchParams(params: URLSearchParams): TabKey {
  const raw = (params.get('tab') || 'profile') as TabKey;
  return TAB_ORDER.some((t) => t.key === raw) ? raw : 'profile';
}

export function ClientDetailTabs({ client }: { client: ClientProfileType }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getTabFromSearchParams(searchParams);

  const setActiveTab = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="bg-white rounded-lg border overflow-x-auto">
        <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b">
          {TAB_ORDER.map((t) => (
            <TabsTrigger
              key={t.key}
              value={t.key}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <Suspense fallback={<LoadingState variant="inline" />}>
        <TabsContent value="profile" className="mt-0">
          <ProfileTab client={client} />
        </TabsContent>
        <TabsContent value="goals" className="mt-0">
          <GoalsTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="sessions" className="mt-0">
          <SessionsTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="homework" className="mt-0">
          <HomeworkTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="resources" className="mt-0">
          <ResourcesTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="strategies" className="mt-0">
          <StrategiesTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="mood" className="mt-0">
          <MoodJournalTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="team" className="mt-0">
          <TeamTab client={client} />
        </TabsContent>
      </Suspense>
    </Tabs>
  );
}


