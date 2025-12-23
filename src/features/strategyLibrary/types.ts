export type StrategyFormData = {
  title: string;
  description: string;
  type: 'antecedent' | 'reinforcement' | 'regulation';
  whenToUse: string;
  howToUse: string;
  steps: string[];
  examples: string[];
  targetZone: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | '';
  global: boolean;
};

export type StrategyTypeFilter = 'all' | StrategyFormData['type'];


