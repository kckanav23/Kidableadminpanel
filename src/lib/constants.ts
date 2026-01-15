import { TherapyType, Zone, StrategyType } from '../types';

export const THERAPY_COLORS: Record<TherapyType, string> = {
  aba: '#5B9FED',
  speech: '#9393F8',
  ot: '#FF9B85',
};

export const THERAPY_LABELS: Record<TherapyType, string> = {
  aba: 'ABA',
  speech: 'Speech',
  ot: 'OT',
};

export const THERAPY_ICONS: Record<TherapyType, string> = {
  aba: '🧩',
  speech: '💬',
  ot: '✋',
};

export const ZONE_COLORS: Record<Zone, string> = {
  green: '#4CAF50',
  yellow: '#F4D16B',
  orange: '#FF9B85',
  red: '#E63946',
  blue: '#5B9FED',
};

export const ZONE_LABELS: Record<Zone, string> = {
  green: 'Green Zone',
  yellow: 'Yellow Zone',
  orange: 'Orange Zone',
  red: 'Red Zone',
  blue: 'Blue Zone',
};

export const ZONE_DESCRIPTIONS: Record<Zone, string> = {
  green: 'Calm, focused, ready to learn',
  yellow: 'Elevated energy, anxious, frustrated',
  orange: 'Dysregulated, agitated',
  red: 'Crisis, meltdown',
  blue: 'Low energy, tired, withdrawn',
};

export const STRATEGY_TYPE_LABELS: Record<StrategyType, string> = {
  antecedent: 'Antecedent Strategies',
  reinforcement: 'Reinforcement Strategies',
  regulation: 'Regulation Strategies',
};

export type SensoryProfileKey = 'visual' | 'auditory' | 'tactile' | 'vestibular' | 'proprioceptive';

export const SENSORY_PROFILE_ICONS: Record<SensoryProfileKey, string> = {
  visual: '👁️',
  auditory: '👂',
  tactile: '✋',
  vestibular: '🔄',
  proprioceptive: '💪',
};