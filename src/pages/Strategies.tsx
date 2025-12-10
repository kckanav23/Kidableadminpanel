import { useState } from 'react';
import { strategies } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Eye } from 'lucide-react';
import { currentUser } from '../lib/mockData';
import { STRATEGY_TYPE_LABELS } from '../lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Strategies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  let filteredStrategies = strategies;

  if (searchQuery) {
    filteredStrategies = filteredStrategies.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (typeFilter !== 'all') {
    filteredStrategies = filteredStrategies.filter(s => s.type === typeFilter);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Strategy Library</h1>
        {currentUser.role === 'admin' && (
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
            <Plus className="size-4" />
            New Strategy
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="antecedent">Antecedent</SelectItem>
                <SelectItem value="reinforcement">Reinforcement</SelectItem>
                <SelectItem value="regulation">Regulation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Strategies List */}
      <Card>
        <CardHeader>
          <CardTitle>{filteredStrategies.length} Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStrategies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No strategies found</p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStrategies.map(strategy => (
                <Card key={strategy.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{strategy.title}</CardTitle>
                          <Badge variant="outline" className="text-teal-700 border-teal-700">
                            {STRATEGY_TYPE_LABELS[strategy.type]}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{strategy.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">When to Use</p>
                      <p className="text-sm">{strategy.whenToUse}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600 mb-1">How to Use</p>
                      <p className="text-sm whitespace-pre-line">{strategy.howToUse}</p>
                    </div>

                    {strategy.examples && strategy.examples.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Examples</p>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {strategy.examples.map((example, idx) => (
                            <li key={idx}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="size-4" />
                        View Full Details
                      </Button>
                      {currentUser.role === 'admin' && (
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
