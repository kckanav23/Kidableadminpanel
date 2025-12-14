import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Globe, Eye, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { STRATEGY_TYPE_LABELS } from '../../lib/constants';
import { StrategyType } from '../../types';
import { Progress } from '../ui/progress';
import { getApiClient } from '../../lib/api-client';
import type { StrategiesByTypeResponse, StrategyResponse } from '../../types/api';
import { toast } from 'sonner';

interface ClientStrategiesProps {
  clientId: string;
}

export function ClientStrategies({ clientId }: ClientStrategiesProps) {
  const [strategies, setStrategies] = useState<StrategiesByTypeResponse>({});
  const [loading, setLoading] = useState(true);

  // Fetch strategies from API
  useEffect(() => {
    const fetchStrategies = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminStrategies.getAll1({ clientId });
        setStrategies(response);
      } catch (error) {
        console.error('Error fetching strategies:', error);
        toast.error('Failed to load strategies');
        setStrategies({});
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, [clientId]);

  const handleUnassign = async (strategyId: string) => {
    try {
      const api = getApiClient();
      await api.adminStrategies.unassign1({
        clientId,
        strategyId,
      });

      // Refresh strategies list
      const updated = await api.adminStrategies.getAll1({ clientId });
      setStrategies(updated);

      toast.success('Strategy unassigned successfully');
    } catch (error) {
      console.error('Error unassigning strategy:', error);
      toast.error('Failed to unassign strategy');
    }
  };

  const allStrategies = [
    ...(strategies.antecedent || []),
    ...(strategies.reinforcement || []),
    ...(strategies.regulation || []),
  ];
  const groupedStrategies = {
    antecedent: strategies.antecedent || [],
    reinforcement: strategies.reinforcement || [],
    regulation: strategies.regulation || [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl">{allStrategies.length} Strategies</h2>
        <Button className="gap-2 bg-[#0B5B45] hover:bg-[#0D6953]">
          <Plus className="size-4" />
          Assign Strategy
        </Button>
      </div>

      {/* Strategies by Type */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto" />
            <p className="text-slate-600 mt-2">Loading strategies...</p>
          </CardContent>
        </Card>
      ) : allStrategies.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-600 mb-4">No strategies assigned yet</p>
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Assign First Strategy
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedStrategies).map(([type, typeStrategies]) => 
          typeStrategies.length > 0 && (
            <div key={type}>
              <h3 className="text-sm text-slate-600 mb-3">
                {STRATEGY_TYPE_LABELS[type as StrategyType]}
              </h3>
              <div className="space-y-4">
                {typeStrategies.map(strategy => {
                  const effectivenessNum = strategy.effectiveness ? parseFloat(strategy.effectiveness) : 0;
                  return (
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
                        {effectivenessNum > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600">Effectiveness</span>
                              <span className="font-medium">
                                {effectivenessNum >= 70 ? 'High' : effectivenessNum >= 40 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                            <Progress value={effectivenessNum} className="h-2" />
                          </div>
                        )}

                        {strategy.assignedDate && (
                          <p className="text-sm">
                            <span className="text-slate-600">Assigned: </span>
                            {formatDate(new Date(strategy.assignedDate))}
                          </p>
                        )}

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
                          {strategy.id && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUnassign(strategy.id!)}
                            >
                              Unassign
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}