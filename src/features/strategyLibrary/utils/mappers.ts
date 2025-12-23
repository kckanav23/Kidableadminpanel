import type { StrategyCreateRequest, StrategyUpdateRequest } from '@/types/api';
import { StrategyCreateRequest as StrategyCreateRequestNs, StrategyUpdateRequest as StrategyUpdateRequestNs } from '@/types/api';
import type { StrategyFormData } from '@/features/strategyLibrary/types';

export type StrategyTypeKey = 'antecedent' | 'reinforcement' | 'regulation';

export function isStrategyTypeFilter(value: string): value is 'all' | StrategyTypeKey {
  return value === 'all' || value === 'antecedent' || value === 'reinforcement' || value === 'regulation';
}

export function isStrategyTypeKey(value: unknown): value is StrategyTypeKey {
  return value === 'antecedent' || value === 'reinforcement' || value === 'regulation';
}

export function toCreateTypeEnum(value: StrategyFormData['type']): StrategyCreateRequestNs.type {
  if (value === 'antecedent') return StrategyCreateRequestNs.type.ANTECEDENT;
  if (value === 'reinforcement') return StrategyCreateRequestNs.type.REINFORCEMENT;
  return StrategyCreateRequestNs.type.REGULATION;
}

export function toUpdateTypeEnum(value: StrategyFormData['type']): StrategyUpdateRequestNs.type {
  if (value === 'antecedent') return StrategyUpdateRequestNs.type.ANTECEDENT;
  if (value === 'reinforcement') return StrategyUpdateRequestNs.type.REINFORCEMENT;
  return StrategyUpdateRequestNs.type.REGULATION;
}

export function toCreateTargetZoneEnum(value: StrategyFormData['targetZone']): StrategyCreateRequestNs.targetZone | undefined {
  if (!value) return undefined;
  if (value === 'green') return StrategyCreateRequestNs.targetZone.GREEN;
  if (value === 'yellow') return StrategyCreateRequestNs.targetZone.YELLOW;
  if (value === 'orange') return StrategyCreateRequestNs.targetZone.ORANGE;
  if (value === 'red') return StrategyCreateRequestNs.targetZone.RED;
  return StrategyCreateRequestNs.targetZone.BLUE;
}

export function toUpdateTargetZoneEnum(value: StrategyFormData['targetZone']): StrategyUpdateRequestNs.targetZone | undefined {
  if (!value) return undefined;
  if (value === 'green') return StrategyUpdateRequestNs.targetZone.GREEN;
  if (value === 'yellow') return StrategyUpdateRequestNs.targetZone.YELLOW;
  if (value === 'orange') return StrategyUpdateRequestNs.targetZone.ORANGE;
  if (value === 'red') return StrategyUpdateRequestNs.targetZone.RED;
  return StrategyUpdateRequestNs.targetZone.BLUE;
}

export function buildCreateRequest(data: StrategyFormData): StrategyCreateRequest {
  return {
    title: data.title,
    description: data.description || undefined,
    type: toCreateTypeEnum(data.type),
    whenToUse: data.whenToUse || undefined,
    howToUse: data.howToUse || undefined,
    steps: data.steps.length > 0 ? data.steps : undefined,
    examples: data.examples.length > 0 ? data.examples : undefined,
    targetZone: toCreateTargetZoneEnum(data.targetZone),
    global: data.global,
  };
}

export function buildUpdateRequest(data: StrategyFormData): StrategyUpdateRequest {
  return {
    title: data.title,
    description: data.description || undefined,
    type: toUpdateTypeEnum(data.type),
    whenToUse: data.whenToUse || undefined,
    howToUse: data.howToUse || undefined,
    steps: data.steps.length > 0 ? data.steps : undefined,
    examples: data.examples.length > 0 ? data.examples : undefined,
    targetZone: toUpdateTargetZoneEnum(data.targetZone),
    global: data.global,
  };
}


