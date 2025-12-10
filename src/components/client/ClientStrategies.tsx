import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Globe, Eye } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { STRATEGY_TYPE_LABELS } from '../../lib/constants';
import { StrategyType } from '../../types';
import { Progress } from '../ui/progress';

interface ClientStrategiesProps {
  clientId: string;
}

// Mock assigned strategies for this client
const assignedStrategies = [
  {
    id: 'st1',
    title: 'Visual Schedule',
    description: 'Use a picture schedule to preview daily activities',
    type: 'antecedent' as StrategyType,
    effectiveness: 80,
    assignedDate: new Date('2025-09-01'),
    customNotes: 'Works best in the morning before transitions',
  },
  {
    id: 'st2',
    title: 'Token Economy',
    description: 'Award tokens for desired behaviors that can be exchanged for rewards',
    type: 'reinforcement' as StrategyType,
    effectiveness: 90,
    assignedDate: new Date('2025-09-01'),
    customNotes: 'Use dinosaur stickers as tokens',
  },
  {
    id: 'st3',
    title: 'Deep Pressure Input',
    description: 'Apply firm, calming pressure to help with regulation',
    type: 'regulation' as StrategyType,
    effectiveness: 70,
    assignedDate: new Date('2025-10-15'),
    customNotes: '',
  },
];

const groupedStrategies = assignedStrategies.reduce((acc, strategy) => {
  if (!acc[strategy.type]) {
    acc[strategy.type] = [];
  }
  acc[strategy.type].push(strategy);
  return acc;
}, {} as Record<StrategyType, typeof assignedStrategies>);

export function ClientStrategies({ clientId }: ClientStrategiesProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{assignedStrategies.length} Strategies</h2>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          Assign Strategy
        </Button>
      </div>

      {/* Strategies by Type */}
      {Object.entries(groupedStrategies).map(([type, strategies]) => (
        <div key={type}>
          <h3 className="text-sm text-slate-600 mb-3">
            {STRATEGY_TYPE_LABELS[type as StrategyType]}
          </h3>
          <div className="space-y-4">
            {strategies.map(strategy => (
              <Card key={strategy.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="size-4 text-[#0B5B45]" />
                        <CardTitle className="text-lg">{strategy.title}</CardTitle>
                      </div>
                      <p className="text-sm text-slate-600">{strategy.description}</p>
                    </div>
                    <Badge variant="outline" className="text-[#0B5B45] border-[#0B5B45]">
                      {type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Effectiveness</span>
                      <span className="font-medium">
                        {strategy.effectiveness >= 70 ? 'High' : strategy.effectiveness >= 40 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <Progress value={strategy.effectiveness} className="h-2" />
                  </div>

                  <p className="text-sm">
                    <span className="text-slate-600">Assigned: </span>
                    {formatDate(strategy.assignedDate)}
                  </p>

                  {strategy.customNotes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="text-slate-600">Custom Notes: </span>
                        {strategy.customNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="size-4" />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Unassign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {assignedStrategies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No strategies assigned yet</p>
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Assign First Strategy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}