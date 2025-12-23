import type { Session, TherapyType, Zone } from '@/types';
import { SessionActivityCreateRequest } from '@/types/api';
import type { SessionResponse } from '@/types/api';

export function normalizePromptType(promptType?: string): SessionActivityCreateRequest.promptType | undefined {
  if (!promptType) return undefined;
  const lower = promptType.toLowerCase();

  const mapping: Record<string, SessionActivityCreateRequest.promptType> = {
    // Backward compatibility for older label variants (kept intentionally small)
    'full physical': SessionActivityCreateRequest.promptType.FULL_PHYSICAL,
    'partial physical': SessionActivityCreateRequest.promptType.PARTIAL_PHYSICAL,
    full_physical: SessionActivityCreateRequest.promptType.FULL_PHYSICAL,
    partial_physical: SessionActivityCreateRequest.promptType.PARTIAL_PHYSICAL,
    verbal: SessionActivityCreateRequest.promptType.VERBAL,
    textual: SessionActivityCreateRequest.promptType.TEXTUAL,
    gestural: SessionActivityCreateRequest.promptType.GESTURAL,
    independent: SessionActivityCreateRequest.promptType.INDEPENDENT,
  };

  const mapped = mapping[lower];
  if (mapped) return mapped;

  // If it already matches enum values, allow it.
  const allowed = new Set<string>(Object.values(SessionActivityCreateRequest.promptType));
  return allowed.has(lower) ? (lower as SessionActivityCreateRequest.promptType) : undefined;
}

export function mapSessionResponseToSession(apiSession: SessionResponse): Session {
  const therapyTypeMap: Record<string, TherapyType> = {
    ABA: 'aba',
    Speech: 'speech',
    OT: 'ot',
  };
  const therapyType = therapyTypeMap[String(apiSession.therapy || 'ABA')] || 'aba';

  const zone = (apiSession.zone?.toLowerCase() as Zone) || 'green';

  return {
    id: apiSession.id || '',
    clientId: apiSession.clientId || '',
    sessionNumber: apiSession.sessionNumber || 0,
    date: apiSession.sessionDate ? new Date(apiSession.sessionDate) : new Date(),
    therapyType,
    zone,
    // API only provides therapist summary (no id at the moment)
    therapistId: '',
    longTermObjective: apiSession.longTermObjective || '',
    shortTermObjective: apiSession.shortTermObjective || '',
    activities:
      apiSession.sessionActivities?.map((activity) => ({
        id: activity.id || '',
        name: activity.activity || '',
        antecedent: activity.antecedent || '',
        behavior: activity.behaviour || '',
        consequence: activity.consequences || '',
        promptType: activity.promptType,
      })) || [],
    successes: apiSession.successes || [],
    struggles: apiSession.struggles || [],
    interventions: apiSession.interventionsUsed || [],
    strategies: apiSession.strategiesUsed || [],
    reinforcements: apiSession.reinforcementTypes || [],
    notes: apiSession.additionalNotes,
    discussedWithParent: apiSession.discussionStatus?.includes('discussed') || false,
  };
}


