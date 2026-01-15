import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoneBadge } from '@/components/badges/ZoneBadge';
import { formatDateTime } from '@/lib/utils';

import { useClientMoodEntries } from '@/features/clients/tabs/journal/hooks/useClientMoodEntries';
import { useClientJournalEntries } from '@/features/clients/tabs/journal/hooks/useClientJournalEntries';
import { mapJournalEntryResponse, mapMoodEntryToChartData } from '@/features/clients/tabs/journal/utils/mappers';

type TimeRange = '7d' | '30d' | '90d';

function toDays(range: TimeRange) {
  return range === '7d' ? 7 : range === '30d' ? 30 : 90;
}

export function MoodJournalTab({ clientId }: { clientId: string }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const days = toDays(timeRange);

  const moodQuery = useClientMoodEntries({ clientId, days });
  const journalQuery = useClientJournalEntries({ clientId, limit: 100 });

  const loading = moodQuery.isLoading || journalQuery.isLoading;

  const chartData = useMemo(() => {
    const data = (moodQuery.data || []).map(mapMoodEntryToChartData).sort((a, b) => a.date.getTime() - b.date.getTime());
    return data;
  }, [moodQuery.data]);

  const journalEntries = useMemo(() => (journalQuery.data || []).map(mapJournalEntryResponse), [journalQuery.data]);
  const sortedEntries = useMemo(() => [...journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [journalEntries]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mood Trend</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7d')}
              className={timeRange === '7d' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30d')}
              className={timeRange === '30d' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90d')}
              className={timeRange === '90d' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              90 Days
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <p className="text-slate-600 ml-2">Loading mood data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-slate-600">No mood entries available for this time period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" tickFormatter={(value) => value} />
                <YAxis
                  domain={[0, 6]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => {
                    const labels: Record<number, string> = { 1: 'Blue', 2: 'Green', 3: 'Yellow', 4: 'Orange', 5: 'Red' };
                    return labels[value] || '';
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload as { dateLabel: string; zone: string };
                      return (
                        <div className="bg-white border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium">{data.dateLabel}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <ZoneBadge zone={data.zone as any} />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl mb-4">Journal Entries ({journalEntries.length})</h2>
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
              <p className="text-slate-600 mt-2">Loading entries...</p>
            </CardContent>
          </Card>
        ) : sortedEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600">No journal entries yet</p>
              <p className="text-sm text-slate-500 mt-1">Entries are logged by parents in the mobile app</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{formatDateTime(entry.date)}</p>
                      <p className="text-sm text-slate-600">Logged by: {entry.loggedBy}</p>
                    </div>
                    <ZoneBadge zone={entry.zone} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.energyGivers.length > 0 ? (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">⚡ Energy Givers</p>
                      <p className="text-sm">{entry.energyGivers.join(', ')}</p>
                    </div>
                  ) : null}

                  {entry.energyDrainers.length > 0 ? (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">😓 Energy Drainers</p>
                      <p className="text-sm">{entry.energyDrainers.join(', ')}</p>
                    </div>
                  ) : null}

                  {entry.relaxingActivity ? (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">🧘 Relaxing Activity</p>
                      <p className="text-sm">{entry.relaxingActivity}</p>
                    </div>
                  ) : null}

                  {entry.notes ? (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-slate-600 mb-1">💭 Notes</p>
                      <p className="text-sm italic">"{entry.notes}"</p>
                    </div>
                  ) : null}

                  {entry.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {entry.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


