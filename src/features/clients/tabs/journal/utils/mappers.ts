import type { JournalEntry } from '@/types';
import type { JournalEntryResponse, MoodEntryResponse } from '@/types/api';

const zoneToValue: Record<string, number> = {
  red: 5,
  orange: 4,
  yellow: 3,
  green: 2,
  blue: 1,
};

export function mapJournalEntryResponse(apiEntry: JournalEntryResponse): JournalEntry {
  return {
    id: apiEntry.id || '',
    clientId: apiEntry.clientId || '',
    date: apiEntry.entryDate ? new Date(apiEntry.entryDate) : new Date(),
    zone: (apiEntry.zone?.toLowerCase() as JournalEntry['zone']) || 'green',
    energyGivers: apiEntry.energyGivers ? apiEntry.energyGivers.split(',').map((s) => s.trim()).filter(Boolean) : [],
    energyDrainers: apiEntry.energyDrainers ? apiEntry.energyDrainers.split(',').map((s) => s.trim()).filter(Boolean) : [],
    relaxingActivity: apiEntry.relaxingActivity,
    notes: apiEntry.additionalNotes,
    tags: apiEntry.tags || [],
    loggedBy: apiEntry.parent?.fullName || 'Parent',
  };
}

export function mapMoodEntryToChartData(apiEntry: MoodEntryResponse) {
  const date = apiEntry.entryDate ? new Date(apiEntry.entryDate) : new Date();
  const zone = (apiEntry.zone?.toLowerCase() as string) || 'green';
  return {
    date,
    dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: zoneToValue[zone] || 2,
    zone,
  };
}


